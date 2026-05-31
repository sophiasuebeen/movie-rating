const crypto = require('crypto');
const express = require('express');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');

const config = require('./config');
const { corsMiddleware, errorHandler, notFoundHandler, validateRequest } = require('./middleware');
const {
  createListSchema,
  addMovieSchema,
  compareMovieSchema,
  getMoviesSchema,
  shareListSchema,
  getPublicRankingSchema,
} = require('./validation');

const app = express();
const prisma = new PrismaClient();
const validBuckets = new Set(['liked', 'fine', 'disliked']);
const bucketOrder = [
  { bucket: 'liked', label: 'I liked it' },
  { bucket: 'fine', label: 'It was fine' },
  { bucket: 'disliked', label: "I didn't like it" },
];
const scoreRanges = {
  liked: { min: 7.0, max: 10.0 },
  fine: { min: 4.0, max: 6.9 },
  disliked: { min: 1.0, max: 3.9 },
};

// ============ HELPER FUNCTIONS ============

function calculateScore(bucket, position, bucketSize) {
  const range = scoreRanges[bucket];

  if (!range) {
    return null;
  }

  if (bucketSize <= 1) {
    return range.max;
  }

  const positionFromTop = position - 1;
  const scoreStep = (range.max - range.min) / (bucketSize - 1);
  const score = range.max - positionFromTop * scoreStep;

  return Number(score.toFixed(1));
}

function buildBucketGroups(movies) {
  return bucketOrder
    .map(({ bucket, label }) => ({
      bucket,
      label,
      movies: movies
        .filter((movie) => movie.bucket === bucket)
        .sort((firstMovie, secondMovie) => firstMovie.position - secondMovie.position),
    }))
    .map((bucketGroup) => ({
      ...bucketGroup,
      movies: bucketGroup.movies.map((movie) => ({
        ...movie,
        score: calculateScore(bucketGroup.bucket, movie.position, bucketGroup.movies.length),
      })),
    }));
}

function createShareSlug() {
  return crypto.randomBytes(6).toString('base64url');
}

// ============ MIDDLEWARE ============

app.use(express.json({ limit: '10mb' }));
app.use(corsMiddleware);

if (config.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ============ ROUTES ============

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/lists', validateRequest(createListSchema), async (req, res, next) => {
  try {
    const { body } = req.validated;
    const list = await prisma.movieList.create({
      data: {
        name: body.name || 'My Movie Ranking',
      },
    });

    res.status(201).json(list);
  } catch (error) {
    next(error);
  }
});

app.get('/api/lists/:listId/movies', validateRequest(getMoviesSchema), async (req, res, next) => {
  try {
    const { params } = req.validated;
    const { listId } = params;

    const list = await prisma.movieList.findUnique({
      where: { id: listId },
      select: { id: true },
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found.' });
    }

    const movies = await prisma.movie.findMany({
      where: { listId, status: 'ranked' },
      orderBy: { position: 'asc' },
    });

    const buckets = buildBucketGroups(movies);

    res.json({ listId, buckets });
  } catch (error) {
    next(error);
  }
});

app.post('/api/lists/:listId/share', validateRequest(shareListSchema), async (req, res, next) => {
  try {
    const { params } = req.validated;
    const { listId } = params;

  try {
    const list = await prisma.movieList.findUnique({
      where: { id: listId },
      select: { id: true, shareSlug: true },
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found.' });
    }

    if (list.shareSlug) {
      return res.json({ shareSlug: list.shareSlug });
    }

    let updatedList = null;

    for (let attempts = 0; attempts < 5; attempts += 1) {
      try {
        updatedList = await prisma.movieList.update({
          where: { id: listId },
          data: { shareSlug: createShareSlug() },
          select: { shareSlug: true },
        });
        break;
      } catch (error) {
        if (error.code !== 'P2002') {
          throw error;
        }
      }
    }

    if (!updatedList) {
      return res.status(500).json({ error: 'Failed to create share link.' });
    }

    res.status(201).json({ shareSlug: updatedList.shareSlug });
  } catch (error) {
    next(error);
  }
});

app.get('/api/public/:shareSlug', validateRequest(getPublicRankingSchema), async (req, res, next) => {
  try {
    const { params } = req.validated;
    const { shareSlug } = params;

  try {
    const list = await prisma.movieList.findUnique({
      where: { shareSlug },
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
    });

    if (!list) {
      return res.status(404).json({ error: 'Shared ranking not found.' });
    }

    const movies = await prisma.movie.findMany({
      where: { listId: list.id, status: 'ranked' },
      orderBy: { position: 'asc' },
    });

    res.json({
      list: {
        name: list.name || 'Movie Ranking',
        updatedAt: list.updatedAt,
      },
      buckets: buildBucketGroups(movies),
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/lists/:listId/movies', validateRequest(addMovieSchema), async (req, res, next) => {
  try {
    const { body, params } = req.validated;
    const { listId } = params;
    const { title, bucket } = body;
    const list = await prisma.movieList.findUnique({
      where: { id: listId },
      select: { id: true },
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found.' });
    }

    const rankedMovies = await prisma.movie.findMany({
      where: { listId, bucket, status: 'ranked' },
      orderBy: { position: 'asc' },
    });

    if (rankedMovies.length === 0) {
      const movie = await prisma.movie.create({
        data: {
          title: trimmedTitle,
          bucket,
          position: 1,
          status: 'ranked',
          listId,
        },
      });

      return res.status(201).json({ complete: true, movie });
    }

    const movie = await prisma.movie.create({
      data: {
        title: trimmedTitle,
        bucket,
        position: 0,
        status: 'pending',
        listId,
      },
    });

    res.status(201).json({ complete: false, movie, candidate: rankedMovies[0] });
  } catch (error) {
    next(error);
  }
});

app.post('/api/lists/:listId/movies/:movieId/compare', validateRequest(compareMovieSchema), async (req, res, next) => {
  try {
    const { body, params } = req.validated;
    const { listId, movieId } = params;
    const { candidateMovieId, winnerMovieId } = body;
    const pendingMovie = await prisma.movie.findFirst({
      where: { id: movieId, listId, status: 'pending' },
    });

    if (!pendingMovie) {
      return res.status(404).json({ error: 'Pending movie not found.' });
    }

    const candidateMovie = await prisma.movie.findFirst({
      where: {
        id: candidateMovieId,
        listId,
        bucket: pendingMovie.bucket,
        status: 'ranked',
      },
    });

    if (!candidateMovie) {
      return res.status(404).json({ error: 'Comparison candidate not found.' });
    }

    if (![pendingMovie.id, candidateMovie.id].includes(winnerMovieId)) {
      return res.status(400).json({ error: 'Winner must be the pending movie or the candidate movie.' });
    }

    if (winnerMovieId === pendingMovie.id) {
      const movie = await prisma.$transaction(async (tx) => {
        await tx.movie.updateMany({
          where: {
            listId,
            bucket: pendingMovie.bucket,
            status: 'ranked',
            position: { gte: candidateMovie.position },
          },
          data: {
            position: { increment: 1 },
          },
        });

        await tx.comparison.create({
          data: {
            listId,
            bucket: pendingMovie.bucket,
            winnerMovieId: pendingMovie.id,
            loserMovieId: candidateMovie.id,
          },
        });

        return tx.movie.update({
          where: { id: pendingMovie.id },
          data: {
            position: candidateMovie.position,
            status: 'ranked',
          },
        });
      });

      return res.json({ complete: true, movie });
    }

    await prisma.comparison.create({
      data: {
        listId,
        bucket: pendingMovie.bucket,
        winnerMovieId: candidateMovie.id,
        loserMovieId: pendingMovie.id,
      },
    });

    const nextCandidate = await prisma.movie.findFirst({
      where: {
        listId,
        bucket: pendingMovie.bucket,
        status: 'ranked',
        position: { gt: candidateMovie.position },
      },
      orderBy: { position: 'asc' },
    });

    if (nextCandidate) {
      return res.json({ complete: false, movie: pendingMovie, candidate: nextCandidate });
    }

    const maxPosition = await prisma.movie.aggregate({
      where: { listId, bucket: pendingMovie.bucket, status: 'ranked' },
      _max: { position: true },
    });

    const movie = await prisma.movie.update({
      where: { id: pendingMovie.id },
      data: {
        position: (maxPosition._max.position ?? 0) + 1,
        status: 'ranked',
      },
    });

    res.json({ complete: true, movie });
  } catch (error) {
    next(error);
  }
});

// ============ ERROR HANDLING ============

app.use(notFoundHandler);
app.use(errorHandler);

// ============ SERVER STARTUP ============

const port = config.port;

app.listen(port, () => {
  console.log(`🎬 Movie Rating server running on http://localhost:${port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const port = process.env.PORT || 4000;
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

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/lists', async (req, res) => {
  try {
    const list = await prisma.movieList.create({
      data: {
        name: req.body.name || 'My Movie Ranking',
      },
    });

    res.status(201).json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create list.' });
  }
});

app.get('/api/lists/:listId/movies', async (req, res) => {
  const { listId } = req.params;

  try {
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

    const buckets = bucketOrder.map(({ bucket, label }) => ({
      bucket,
      label,
      movies: movies
        .filter((movie) => movie.bucket === bucket)
        .sort((firstMovie, secondMovie) => firstMovie.position - secondMovie.position),
    })).map((bucketGroup) => ({
      ...bucketGroup,
      movies: bucketGroup.movies.map((movie) => ({
        ...movie,
        score: calculateScore(bucketGroup.bucket, movie.position, bucketGroup.movies.length),
      })),
    }));

    res.json({ listId, buckets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load movies.' });
  }
});

app.post('/api/lists/:listId/movies', async (req, res) => {
  const { listId } = req.params;
  const { title, bucket } = req.body;
  const trimmedTitle = typeof title === 'string' ? title.trim() : '';

  if (!trimmedTitle) {
    return res.status(400).json({ error: 'Title is required.' });
  }

  if (!validBuckets.has(bucket)) {
    return res.status(400).json({ error: 'Bucket must be one of: liked, fine, disliked.' });
  }

  try {
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
    console.error(error);
    res.status(500).json({ error: 'Failed to create movie.' });
  }
});

app.post('/api/lists/:listId/movies/:movieId/compare', async (req, res) => {
  const { listId, movieId } = req.params;
  const { candidateMovieId, winnerMovieId } = req.body;

  if (!candidateMovieId || !winnerMovieId) {
    return res.status(400).json({ error: 'Candidate movie and winner are required.' });
  }

  try {
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
    console.error(error);
    res.status(500).json({ error: 'Failed to save comparison.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

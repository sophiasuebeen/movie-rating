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

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
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
      where: { listId },
      orderBy: [{ bucket: 'asc' }, { position: 'asc' }],
    });

    const buckets = bucketOrder.map(({ bucket, label }) => ({
      bucket,
      label,
      movies: movies
        .filter((movie) => movie.bucket === bucket)
        .sort((firstMovie, secondMovie) => firstMovie.position - secondMovie.position),
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

    const maxPosition = await prisma.movie.aggregate({
      where: { listId, bucket },
      _max: { position: true },
    });

    const movie = await prisma.movie.create({
      data: {
        title: trimmedTitle,
        bucket,
        position: (maxPosition._max.position ?? 0) + 1,
        listId,
      },
    });

    res.status(201).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create movie.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

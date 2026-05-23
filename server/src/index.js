const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const port = process.env.PORT || 4000;
const prisma = new PrismaClient();
const validBuckets = new Set(['liked', 'fine', 'disliked']);

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
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

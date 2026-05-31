const { z } = require('zod');

const bucketSchema = z.enum(['liked', 'fine', 'disliked']);

const createListSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255).optional(),
  }),
});

const addMovieSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255),
    bucket: bucketSchema,
  }),
  params: z.object({
    listId: z.string().cuid(),
  }),
});

const compareMovieSchema = z.object({
  body: z.object({
    candidateMovieId: z.string().cuid(),
    winnerMovieId: z.string().cuid(),
  }),
  params: z.object({
    listId: z.string().cuid(),
    movieId: z.string().cuid(),
  }),
});

const getMoviesSchema = z.object({
  params: z.object({
    listId: z.string().cuid(),
  }),
});

const shareListSchema = z.object({
  params: z.object({
    listId: z.string().cuid(),
  }),
});

const getPublicRankingSchema = z.object({
  params: z.object({
    shareSlug: z.string().min(1),
  }),
});

module.exports = {
  bucketSchema,
  createListSchema,
  addMovieSchema,
  compareMovieSchema,
  getMoviesSchema,
  shareListSchema,
  getPublicRankingSchema,
};

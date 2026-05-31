import { describe, it, expect } from 'vitest';

// Helper function tests
function calculateScore(bucket, position, bucketSize) {
  const scoreRanges = {
    liked: { min: 7.0, max: 10.0 },
    fine: { min: 4.0, max: 6.9 },
    disliked: { min: 1.0, max: 3.9 },
  };

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

describe('calculateScore', () => {
  describe('liked bucket', () => {
    it('should return 10.0 for first and only movie', () => {
      const score = calculateScore('liked', 1, 1);
      expect(score).toBe(10.0);
    });

    it('should return 10.0 for first movie in list of 3', () => {
      const score = calculateScore('liked', 1, 3);
      expect(score).toBe(10.0);
    });

    it('should return 8.5 for middle movie in list of 3', () => {
      const score = calculateScore('liked', 2, 3);
      expect(score).toBe(8.5);
    });

    it('should return 7.0 for last movie in list of 3', () => {
      const score = calculateScore('liked', 3, 3);
      expect(score).toBe(7.0);
    });
  });

  describe('fine bucket', () => {
    it('should return 6.9 for first and only movie', () => {
      const score = calculateScore('fine', 1, 1);
      expect(score).toBe(6.9);
    });

    it('should return 6.9 for first movie in list', () => {
      const score = calculateScore('fine', 1, 2);
      expect(score).toBe(6.9);
    });

    it('should return 4.0 for last movie in list of 2', () => {
      const score = calculateScore('fine', 2, 2);
      expect(score).toBe(4.0);
    });
  });

  describe('disliked bucket', () => {
    it('should return 3.9 for first and only movie', () => {
      const score = calculateScore('disliked', 1, 1);
      expect(score).toBe(3.9);
    });

    it('should return 1.0 for last movie in list of 2', () => {
      const score = calculateScore('disliked', 2, 2);
      expect(score).toBe(1.0);
    });
  });

  it('should return null for invalid bucket', () => {
    const score = calculateScore('invalid', 1, 1);
    expect(score).toBeNull();
  });
});

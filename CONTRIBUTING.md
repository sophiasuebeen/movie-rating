# Contributing to Movie Rating

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please be respectful and inclusive in all interactions with other contributors.

## Getting Started

### 1. Fork and Clone
```bash
git clone https://github.com/your-username/movie-rating.git
cd movie-rating
```

### 2. Install Dependencies
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### Running the Application

```bash
npm run dev
```

This starts both the frontend and backend concurrently.

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# E2E tests
npm run test:e2e

# With coverage
npm test -- --coverage
```

### Code Quality

```bash
# Check for linting issues
npm run lint

# Format code
npm run format

# Type checking (if using TypeScript)
npm run type-check
```

## Making Changes

### Coding Standards

- Use ESLint configuration for consistency
- Follow the existing code style
- Write clear, descriptive commit messages
- Add comments for complex logic
- Keep functions small and focused

### File Organization

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   └── styles/         # CSS/styling

backend/
├── src/
│   ├── routes/         # API route handlers
│   ├── middleware/     # Express middleware
│   ├── utils/          # Utility functions
│   ├── validation/     # Input validation schemas
│   └── __tests__/      # Test files
```

### Commit Messages

Follow conventional commits:

```
feat: Add new feature
fix: Fix a bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

Example:
```
feat: Add movie search functionality

- Implement search API endpoint
- Add search UI component
- Add unit tests for search
```

## Testing

### Writing Tests

1. **Unit Tests** - Test individual functions
```javascript
import { describe, it, expect } from 'vitest';

describe('calculateScore', () => {
  it('should calculate correct score for position', () => {
    const result = calculateScore('liked', 1, 3);
    expect(result).toBe(10.0);
  });
});
```

2. **Integration Tests** - Test API endpoints
```javascript
describe('POST /api/lists/:listId/movies', () => {
  it('should add a movie to a list', async () => {
    // Test implementation
  });
});
```

3. **E2E Tests** - Test complete user flows
```javascript
test('user can add and rank movies', async ({ page }) => {
  // Navigate and interact with the application
});
```

### Test Coverage

Aim for:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Pull Request Process

1. **Update your branch** with latest changes:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run tests locally** to ensure everything passes:
   ```bash
   npm test
   npm run test:e2e
   ```

3. **Push your changes**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request**:
   - Use the PR template
   - Describe what you changed and why
   - Link related issues
   - Add screenshots for UI changes
   - List testing steps

5. **Address review feedback**:
   - Make requested changes
   - Push updates
   - Re-request review

6. **Merge**:
   - Ensure all checks pass
   - Squash and merge for clean history

## Documentation

When adding features:

1. Update relevant documentation in README
2. Add JSDoc comments to functions
3. Update API.md for API changes
4. Add examples in docstrings

Example JSDoc:
```javascript
/**
 * Calculate approximate score for a movie based on ranking position
 * @param {string} bucket - Movie bucket ('liked', 'fine', 'disliked')
 * @param {number} position - Position within the bucket (1-based)
 * @param {number} bucketSize - Total movies in the bucket
 * @returns {number|null} Approximate score 1-10 or null if invalid
 */
function calculateScore(bucket, position, bucketSize) {
  // Implementation
}
```

## Common Tasks

### Adding a New API Endpoint

1. Create validation schema in `server/src/validation.js`
2. Add route handler in `server/src/index.js`
3. Add tests in `server/src/__tests__/`
4. Update API.md documentation
5. Update frontend API client

### Adding a New Frontend Feature

1. Create component in `client/src/components/`
2. Add styles using inline styles or CSS module
3. Add tests for the component
4. Update navigation if needed
5. Test responsiveness on mobile

### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update to latest versions
npm upgrade
```

## Performance Considerations

### Backend
- Avoid N+1 queries (use `include` or `select` in Prisma)
- Cache expensive computations
- Use database indexes
- Implement pagination for large datasets

### Frontend
- Code splitting for large bundles
- Lazy loading for routes and components
- Image optimization
- Memoization for expensive renders

## Security Considerations

- Validate all user inputs
- Use prepared statements (Prisma handles this)
- Sanitize data before displaying
- Use HTTPS in production
- Keep dependencies updated
- Never commit secrets

## Getting Help

- Check existing issues
- Read the documentation
- Ask questions in discussions
- Reach out to maintainers

## Reporting Issues

When reporting bugs:

1. Check if issue already exists
2. Provide clear description
3. Include steps to reproduce
4. Share error messages
5. Include environment details

Example:
```
**Bug**: Movies not ranking correctly

**Steps to reproduce**:
1. Create new list
2. Add movie "A"
3. Add movie "B"
4. Choose movie "A" as winner
5. Observe incorrect position

**Expected**: Movie A should be first
**Actual**: Movie B is first

**Environment**: Chrome 120, localhost
```

## Feature Requests

When suggesting features:

1. Check existing requests
2. Describe the use case
3. Explain the benefit
4. Provide examples

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Thanked in release notes
- Credited in the docs

Thank you for contributing! 🎬

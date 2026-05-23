# Movie Ranking Website Planning

## 1. Project Overview

This project is a beginner-friendly full-stack prototype for a personal movie ranking website. The idea is similar to Beli, but focused on movies instead of restaurants. Users build a list of movies they have watched, then compare two movies at a time by answering one simple question: "Which movie did you like better?"

Instead of asking users to directly assign a numeric rating, the app learns their preferences from many small pairwise choices. Over time, those comparison results create a ranked movie list. The app can then convert that ranking into an approximate 1-10 score for each movie.

The main user problem this solves is that numeric movie ratings can feel difficult and inconsistent. A user might not know whether a movie is a 7.5 or an 8.0, and their rating standards may change over time. But choosing between two movies is usually easier: "I liked Movie A better than Movie B."

Pairwise comparison is useful for this app because:

- It is easier and more natural than assigning exact numbers.
- It produces rankings based on relative preference.
- It avoids users overthinking small rating differences.
- It can become more accurate as the user adds more comparisons.
- It creates an interactive experience instead of a static rating form.

The first version should focus on proving the core loop: add movies, compare movies, see rankings, and share a public ranking page.

## 2. MVP Scope

The MVP should include only the features needed to make the core product work.

Included in the first prototype:

- A simple home page explaining the app.
- A way to add movies to a personal list.
- A page that shows two movies and lets the user choose which one they liked better.
- Storage for movies and pairwise comparison results.
- A simple ranking calculation based on wins and losses.
- A ranking page that shows the user's movies in ranked order.
- An approximate 1-10 score shown next to each ranked movie.
- A simple public share link for a user's ranking page.
- Basic styling that is clean and readable.

Intentionally excluded from the first prototype:

- User accounts and login.
- Friend system, following, or social graph.
- Movie posters, search, trailers, or metadata from an external API.
- Recommendation system.
- Comments, reactions, or social feed.
- Advanced ranking algorithms such as Elo or TrueSkill.
- Mobile-first polished UI.
- Complex privacy controls.
- Admin tools.
- Email notifications.

The MVP should feel like a working prototype, not a complete social product.

## 3. Recommended Tech Stack

Recommended beginner-friendly stack:

- Frontend: React with Vite
- Backend: Node.js with Express
- Database: SQLite for local development
- ORM/query layer: Prisma
- Deployment: Render, Railway, or Fly.io for the backend; Vercel or Netlify for the frontend

Why this stack is appropriate:

- React with Vite is fast to start and beginner-friendly.
- Express keeps backend routes simple and easy to understand.
- SQLite is lightweight and does not require managing a separate database server during development.
- Prisma makes database models easier to define and query.
- The frontend and backend can be developed separately, which helps clarify full-stack concepts.
- The stack can later be upgraded to PostgreSQL without changing the whole app architecture.

Alternative simpler option:

- Use Django with templates and SQLite.

This could be even simpler if the goal is to keep everything in one backend project. Since this workspace appears to contain Python projects, Django may also be a comfortable option. However, if the goal is to practice a modern full-stack JavaScript app, React + Express + SQLite is a good MVP stack.

Recommended MVP choice:

- If you want the easiest single-project path: Django + SQLite.
- If you want a classic frontend/backend full-stack prototype: React + Express + SQLite + Prisma.

For this plan, the suggested structure will assume React + Express + SQLite + Prisma.

## 4. Core User Flow

Add movies:

1. User opens the app.
2. User goes to the Add Movie page.
3. User enters a movie title.
4. App saves the movie to the user's personal list.
5. User can repeat this until they have enough movies to compare.

Compare two movies:

1. User opens the Compare page.
2. App selects two movies from the user's list.
3. User answers: "Which movie did you like better?"
4. App saves the comparison result.
5. App shows another pair to compare.

View personal ranking:

1. User opens the Ranking page.
2. App calculates wins, losses, and ranking score for each movie.
3. App sorts movies from highest score to lowest score.
4. App displays each movie's rank and approximate 1-10 rating.

Share ranking page:

1. User clicks a Share button on the Ranking page.
2. App creates or uses an existing public share ID.
3. App displays a public link.
4. Friends can open the link and view the ranking page.
5. Friends cannot edit the ranking from the public page.

## 5. Database Schema

Keep the MVP schema small and easy to understand.

### Movie

Stores movies added by the user.

Fields:

- id: unique movie ID
- title: movie title
- createdAt: date the movie was added
- listId: ID of the movie list this movie belongs to

### MovieList

Stores one personal movie list. Before user accounts exist, each list can be identified by a random ID.

Fields:

- id: unique list ID
- name: optional list name, such as "My Movie Ranking"
- shareSlug: public random string used for sharing
- createdAt: date the list was created
- updatedAt: date the list was last updated

### Comparison

Stores each pairwise comparison result.

Fields:

- id: unique comparison ID
- listId: ID of the movie list
- winnerMovieId: ID of the movie the user preferred
- loserMovieId: ID of the movie the user liked less
- createdAt: date the comparison happened

### Ranking

For the MVP, rankings can be calculated dynamically instead of stored permanently. A separate Ranking table is optional.

If storing rankings later, possible fields:

- id: unique ranking row ID
- movieId: related movie ID
- listId: related movie list ID
- wins: number of comparison wins
- losses: number of comparison losses
- score: wins minus losses
- approximateRating: generated 1-10 score
- updatedAt: date the ranking was calculated

MVP recommendation:

- Do not create a Ranking table at first.
- Calculate rankings from the Comparison table whenever the Ranking page loads.

## 6. Page-by-Page UI Plan

### Home Page

Purpose:

- Introduce the app.
- Give the user a clear starting point.

Main elements:

- App name.
- Short description: rank movies by choosing between pairs.
- Button to start or open the user's movie list.
- Link to the Ranking page if movies already exist.

### Add Movie Page

Purpose:

- Let the user add movies to their personal list.

Main elements:

- Text input for movie title.
- Add Movie button.
- List of movies already added.
- Delete button can be optional for MVP, but helpful.
- Link or button to start comparing once at least two movies exist.

### Compare Movies Page

Purpose:

- Let the user make pairwise choices.

Main elements:

- Prompt: "Which movie did you like better?"
- Two movie cards or buttons.
- Each movie title displayed clearly.
- User clicks one movie to save it as the winner.
- After choosing, show the next pair.
- Message if fewer than two movies exist.

MVP pair selection can be simple:

- Pick two random movies from the list.
- Avoid selecting the same movie twice.

Later, the app can choose smarter comparisons based on uncertainty.

### Ranking Page

Purpose:

- Show the user's ranked movie list.

Main elements:

- Ranked list from best to lowest.
- Movie title.
- Wins and losses.
- Simple score, such as wins minus losses.
- Approximate 1-10 rating.
- Share button.
- Public share link after generated.

### Public Shared Ranking Page

Purpose:

- Let friends view the user's ranking.

Main elements:

- Public list title.
- Ranked movies.
- Approximate 1-10 ratings.
- Optional timestamp showing when the ranking was last updated.

Important MVP rule:

- Public visitors should only be able to view the ranking.
- They should not be able to add movies or submit comparisons.

## 7. Backend Routes / API Plan

The exact route names can change, but the MVP should need routes like these.

### Movie List Routes

GET /api/lists/:listId

- Gets basic information about one movie list.
- Returns list name, ID, share slug, and movies.

POST /api/lists

- Creates a new movie list.
- Returns the new list ID.

### Movie Routes

GET /api/lists/:listId/movies

- Gets all movies in a list.

POST /api/lists/:listId/movies

- Adds a movie to a list.
- Request body includes the movie title.

DELETE /api/lists/:listId/movies/:movieId

- Deletes a movie from a list.
- Optional for MVP, but useful.

### Comparison Routes

GET /api/lists/:listId/compare

- Returns two movies for the user to compare.
- MVP can return two random movies.

POST /api/lists/:listId/comparisons

- Saves a comparison result.
- Request body includes winnerMovieId and loserMovieId.

### Ranking Routes

GET /api/lists/:listId/rankings

- Calculates and returns ranked movies.
- Includes wins, losses, score, rank position, and approximate 1-10 rating.

### Share Routes

POST /api/lists/:listId/share

- Creates or returns a public share slug for a list.

GET /api/public/:shareSlug

- Gets the public ranking page data.
- Does not expose editing routes.

## 8. Ranking Algorithm

Start with the simplest possible ranking algorithm.

For each movie:

- wins = number of comparisons where this movie was selected as the winner
- losses = number of comparisons where this movie was selected as the loser
- score = wins - losses

Ranking:

1. Sort movies by score from highest to lowest.
2. If two movies have the same score, sort by more wins.
3. If still tied, sort alphabetically or by creation date.

Example:

- Movie A: 5 wins, 1 loss, score 4
- Movie B: 3 wins, 2 losses, score 1
- Movie C: 1 win, 4 losses, score -3

Approximate 1-10 rating:

For MVP, convert ranking position into a rating instead of trying to calculate a perfect statistical score.

Simple formula:

- If there is only one movie, rating = 10.
- Otherwise:
  - rating = 10 - ((rankPosition - 1) / (totalMovies - 1)) * 9

This means:

- Rank 1 gets about 10.
- Last place gets about 1.
- Movies in between are spread across the range.

Round the rating to one decimal place.

Example with 5 movies:

- Rank 1: 10.0
- Rank 2: 7.8
- Rank 3: 5.5
- Rank 4: 3.3
- Rank 5: 1.0

Important limitation:

- This is not a perfect rating system.
- It is simple and understandable, which is good for the MVP.
- It may be less accurate when the user has made only a few comparisons.

Future upgrade:

- Replace wins/losses with Elo ratings.
- Each movie starts with the same rating, such as 1500.
- When one movie beats another, update both ratings.
- Elo would better account for strength of opponents and repeated comparisons.

## 9. Folder Structure

Suggested beginner-friendly folder structure:

```text
movie-rating/
  README.md
  planning.md
  client/
    package.json
    index.html
    src/
      main.jsx
      App.jsx
      api/
        movieLists.js
        movies.js
        comparisons.js
        rankings.js
      pages/
        HomePage.jsx
        AddMoviePage.jsx
        ComparePage.jsx
        RankingPage.jsx
        PublicRankingPage.jsx
      components/
        MovieCard.jsx
        MovieList.jsx
        RankingList.jsx
        ShareLinkBox.jsx
      styles/
        main.css
  server/
    package.json
    prisma/
      schema.prisma
      dev.db
    src/
      index.js
      routes/
        lists.js
        movies.js
        comparisons.js
        rankings.js
        public.js
      services/
        rankingService.js
      utils/
        shareSlug.js
```

Notes:

- `client/` contains the React frontend.
- `server/` contains the Express backend.
- `server/prisma/schema.prisma` defines the database models.
- `rankingService.js` contains ranking logic so it is easy to upgrade later.
- API files in the frontend keep fetch calls organized.

## 10. Step-by-Step Build Plan

Each step should be small enough to ask Codex to implement one at a time.

1. Create the initial project structure.
   - Set up `client/` with React and Vite.
   - Set up `server/` with Express.
   - Add basic README instructions.

2. Set up the backend server.
   - Create a basic Express app.
   - Add a health check route.
   - Confirm the server runs locally.

3. Set up Prisma and SQLite.
   - Install Prisma.
   - Create the initial schema.
   - Add MovieList, Movie, and Comparison models.
   - Run the first migration.

4. Create movie list routes.
   - Add route to create a movie list.
   - Add route to fetch a movie list.

5. Create movie routes.
   - Add route to list movies.
   - Add route to create a movie.
   - Optionally add route to delete a movie.

6. Build the basic React app shell.
   - Add frontend routing.
   - Create Home, Add Movie, Compare, Ranking, and Public Ranking pages.
   - Add simple navigation.

7. Connect Add Movie page to the backend.
   - Create or load a list ID.
   - Add movies through the API.
   - Display saved movies.

8. Build the comparison API.
   - Add route to get two random movies.
   - Add route to save comparison results.
   - Validate that winner and loser are different movies.

9. Build the Compare page.
   - Fetch two movies.
   - Let the user select the preferred movie.
   - Save the comparison.
   - Load the next pair.

10. Build the ranking service.
    - Count wins and losses.
    - Calculate score as wins minus losses.
    - Sort movies into ranked order.
    - Convert rank position into a 1-10 rating.

11. Build the Ranking page.
    - Fetch ranking data from the backend.
    - Display rank, title, wins, losses, score, and approximate rating.

12. Add share link support.
    - Generate a share slug for each list.
    - Add public route by share slug.
    - Add Share button on the Ranking page.

13. Build the Public Ranking page.
    - Load ranking data by share slug.
    - Display ranking in read-only mode.

14. Add basic empty states and error states.
    - No movies yet.
    - Need at least two movies to compare.
    - No comparisons yet.
    - Public link not found.

15. Polish the MVP UI lightly.
    - Make pages readable.
    - Keep layout simple.
    - Avoid spending too much time on advanced design.

16. Test the full user flow manually.
    - Create a list.
    - Add at least five movies.
    - Make several comparisons.
    - View rankings.
    - Open the public share page.

## 11. Risks and Things to Avoid

The main risk is making the MVP too complicated before the core loop works.

Avoid building these first:

- User accounts.
- Login and authentication.
- Friend system.
- Social feed.
- Comments or reactions.
- External movie API integration.
- Poster images.
- Recommendation engine.
- Elo or TrueSkill ranking.
- Complex mobile design.
- Multiple list types.
- Advanced privacy settings.

Things that could make the MVP harder than necessary:

- Trying to make rankings statistically perfect too early.
- Adding movie metadata before users can add and compare movies.
- Building a social network before the personal ranking flow works.
- Designing too many pages before the main API exists.
- Overengineering the database schema.
- Adding authentication before proving the product interaction is fun.

The MVP should answer one question:

"Is it useful and enjoyable to rank movies by comparing them two at a time?"

## 12. Future Feature Roadmap

Possible V2 features:

- User accounts.
- Login and saved personal profiles.
- Editable list names.
- Better public profile pages.
- Movie search using an external movie API.
- Movie posters and release years.
- Better comparison selection, such as comparing movies with similar scores.
- Elo ranking algorithm.
- Basic responsive mobile layout.

Possible V3 features:

- Friend system or following.
- View friends' movie rankings.
- Compare your ranking with a friend's ranking.
- Comments or reactions on shared rankings.
- Recommendation system based on highly ranked movies.
- Multiple lists per user, such as favorite horror movies or best movies of the year.
- Import watched movies from another service.
- TrueSkill or another more advanced ranking algorithm.
- Social feed for recent comparisons or ranking updates.

Long-term product direction:

- A social movie taste graph where users can discover friends with similar taste.
- Personalized movie recommendations based on pairwise preference data.
- Public ranking pages that feel polished and shareable.
- A mobile-first experience for quick comparisons.

# Movie Ranking Website Planning

## 1. Project Overview

This project is a beginner-friendly full-stack movie ranking website. The core idea is to let users add the movies they watched and place each new movie into one of three broad preference buckets before refining its position inside that bucket.

The MVP should reduce comparison friction by letting users classify a new movie as:

- I liked it
- It was fine
- I didn’t like it

After choosing a bucket, the app only compares the new movie against movies already in that bucket. This keeps the experience fast while still producing a full ranked list built from bucket order.

The app avoids asking for direct numeric ratings. Instead, it asks simple questions: first a coarse preference bucket, then a small number of within-bucket comparisons. The final ranking is assembled by combining buckets in this order:

1. I liked it
2. It was fine
3. I didn’t like it

The first version should prove the core loop: add a movie, choose a bucket, insert it into the correct position inside that bucket, see the ranked list, and optionally share it.

## 2. MVP Scope

The MVP should include only the features needed to make the bucket-first ranking flow work.

Included in the first prototype:

- A simple home page explaining the app.
- A single Add Movie page with bucket selection and within-bucket insertion.
- Storage for movies, bucket labels, bucket position, and comparison decisions.
- A ranking page that shows the user's full ranked list by bucket and position.
- An approximate 1–10 score shown next to each ranked movie.
- Basic styling that is clean and readable.

Optional MVP stretch (build only after the core loop works):

- A simple public share link for a user's ranking page.

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
- A separate random pairwise compare page.
- Comparing a new movie against the entire list.

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

Add and place a movie:

1. User opens the app.
2. User enters a new movie title on the Add Movie page.
3. User selects a preference bucket: "I liked it", "It was fine", or "I didn’t like it."
4. If this is the first movie in the bucket and the list is empty, the movie is placed at the top of that bucket.
5. If there are existing movies in the chosen bucket, the app compares the new movie to the current candidate inside that bucket.
6. If the new movie wins, it is inserted above the candidate and the bucket positions shift accordingly.
7. If it loses, the app compares it with the next movie in the same bucket.
8. The app continues until the new movie finds the correct position or reaches the end of the bucket.
9. The movie is inserted into the bucket and the full ranking is created by concatenating buckets in this order: liked, fine, disliked.
10. The app converts the final ranking into an approximate 1–10 score.
11. The user can view the updated ranked list and optionally share it.

Important: this is not a full pairwise comparison system. The user first chooses a rough preference bucket, and only then makes smaller comparisons within that bucket.

View personal ranking:

1. User opens the Ranking page.
2. App loads movies grouped by bucket and ordered within each bucket.
3. App displays each movie's position, bucket label, and approximate 1–10 rating.
4. Optionally, the user can generate a share link.

Share ranking page:

1. User clicks a Share button on the Ranking page.
2. App creates or returns an existing public share ID.
3. App displays a public link.
4. Friends can open the link and view the ranking page.
5. Friends cannot edit the ranking from the public page.

## 5. Database Schema

Keep the MVP schema small and easy to understand.

### Movie

Stores movies added by the user, their bucket, and their position inside that bucket.

Fields:

- id: unique movie ID
- title: movie title
- createdAt: date the movie was added
- listId: ID of the movie list this movie belongs to
- bucket: preference bucket (`liked`, `fine`, or `disliked`)
- position: integer position within the bucket

### MovieList

Stores one personal movie list. Before user accounts exist, each list can be identified by a random ID.

Fields:

- id: unique list ID
- name: optional list name, such as "My Movie Ranking"
- shareSlug: public random string used for sharing
- createdAt: date the list was created
- updatedAt: date the list was last updated

### Comparison

Stores optional within-bucket comparison results used during insertion.

Fields:

- id: unique comparison ID
- listId: ID of the movie list
- bucket: bucket where the comparison happened
- winnerMovieId: ID of the movie the user preferred
- loserMovieId: ID of the movie the user liked less
- createdAt: date the comparison happened

MVP recommendation:

- Do not create a separate Ranking table at first.
- Keep `bucket` and `position` on the Movie model so ranked order is easy to maintain.
- Use the Comparison table only if you want to log within-bucket comparisons or support future ranking improvements.

## 6. Page-by-Page UI Plan

### Home Page

Purpose:

- Introduce the app.
- Give the user a clear starting point.

Main elements:

- App name.
- Short description: add a movie, choose a preference bucket, and insert it into a ranked list.
- Button to start adding a movie.
- Link to the Ranking page.

### Add Movie Page

Purpose:

- Let the user add a new movie and place it into a bucket.

Main elements:

- Text input for movie title.
- Bucket selection options: "I liked it", "It was fine", "I didn’t like it."
- Add Movie button.
- If this is the first movie in the selected bucket, confirm it was placed there.
- If there are existing movies in that bucket, show the current bucket candidate.
- Comparison prompt: "Which movie did you like better?"
- Two movie cards or buttons: the new movie and the current bucket candidate.
- After choosing, show the next comparison inside that bucket or finish insertion.
- Show the current ranked list so the user understands how buckets combine.

### Ranking Page

Purpose:

- Show the user's ranked movie list.

Main elements:

- Bucket sections in order: liked, fine, disliked.
- Movie title.
- Position within the bucket.
- Approximate 1–10 score.
- Share button.
- Public share link after generated.

### Public Shared Ranking Page

Purpose:

- Let friends view the user's ranking.

Main elements:

- Public list title.
- Ranked movies grouped by bucket.
- Approximate 1–10 ratings.
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

- Gets all movies in a list grouped by bucket and ordered within buckets.

POST /api/lists/:listId/movies

- Adds a new movie to a list.
- Request body includes the movie title and selected bucket.
- If there are existing movies in the selected bucket, the response can include the first comparator movie.

DELETE /api/lists/:listId/movies/:movieId

- Deletes a movie from a list.
- Optional for MVP, but useful.

### Bucket Comparison Routes

POST /api/lists/:listId/movies/:movieId/compare

- Saves a within-bucket comparison result.
- Request body includes the current candidate movie ID and the winner.
- Returns the next candidate or the final insertion position inside the bucket.

### Ranking Routes

GET /api/lists/:listId/rankings

- Returns movies grouped by bucket and ordered within each bucket.
- Includes bucket label, within-bucket position, and approximate 1–10 rating.

### Share Routes

POST /api/lists/:listId/share

- Creates or returns a public share slug for a list.

GET /api/public/:shareSlug

- Gets the public ranking page data.
- Does not expose editing routes.

## 8. Ranking Algorithm

Start with the simplest possible bucket-first ranking algorithm.

For the MVP, assign each movie to one of three buckets and place it into the correct position within that bucket.

Bucket-first insertion algorithm:

1. Each movie has a `bucket` (`liked`, `fine`, or `disliked`) and a `position` within that bucket.
2. When a new movie is added, the user selects one bucket.
3. If the chosen bucket is empty, place the movie at position 1 in that bucket.
4. If the bucket contains movies, compare the new movie with the current bucket candidate starting at position 1.
5. If the new movie wins, insert it above that candidate and shift later positions down.
6. If it loses, compare it with the next movie in the bucket.
7. Continue until the correct position is found or the end of the bucket is reached.
8. If the new movie loses to every candidate in the bucket, place it at the bottom of that bucket.
9. The full ranked list is created by concatenating buckets in this order: liked, fine, disliked.

This bucket-first insertion approach keeps comparison friction low and still builds a sensible ranked list. Later, it can be improved with binary insertion, Elo, or smarter active ranking.

Approximate 1–10 score conversion:

- Use bucket order to define broad score ranges.
- Map liked movies to the top score range, fine to the middle range, and disliked to the bottom range.
- Within each bucket, spread scores linearly by position.

Example with a small ranked list:

- Top liked movie: 10.0
- Lower liked movie: 8.0
- Top fine movie: 7.0
- Lower fine movie: 5.0
- Top disliked movie: 4.0
- Lower disliked movie: 1.0

Important limitation:

- This score is approximate and designed for the MVP.
- It is simple and understandable, which is good for early use.
- It may not capture fine-grained preference differences across buckets.

Future upgrade:

- Replace linear bucket insertion with binary insertion inside each bucket.
- Build a more statistical ranking model such as Elo.
- Use comparison history to refine bucket placement confidence.

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
   - Add `MovieList`, `Movie`, and `Comparison` models.
   - Run the first migration.

4. Build the minimal list/movie API.
   - Add route to create a movie list.
   - Add route to fetch movies in ranked order.
   - Add route to add a movie and begin insertion.
   - Optionally add route to delete a movie later.

5. Build the basic React app shell.
   - Add frontend routing.
   - Create Home, Add Movie, Ranking, and Public Ranking pages.
   - Add simple navigation.

6. Connect Add Movie page to the backend.
   - Create or load a list ID in the browser.
   - Add movies through the API.
   - Display saved movies and current ranked list.

7. Build insertion comparison support.
   - Add route to record a comparison result for a new movie.
   - Return the next candidate or final insertion outcome.
   - Validate that winner and loser are different movies.

8. Build the add-movie insertion flow.
   - Show the new movie and the current ranked candidate.
   - Let the user select the preferred movie.
   - Continue comparing until insertion is finished.

9. Build the ranking service.
   - Use the ranked `position` values to order movies.
   - Convert positions into approximate 1–10 scores.
   - Return the ranked list to the frontend.

10. Build the Ranking page.
    - Fetch ranking data from the backend.
    - Display rank, title, position, and approximate rating.

11. Add public share support (optional MVP stretch).
    - Generate a share slug for each list.
    - Add public route by share slug.
    - Add Share button on the Ranking page.

12. Add basic empty states and error states.
    - No movies yet.
    - First movie added.
    - Comparison candidate not found.
    - Public link not found.

13. Polish the MVP UI lightly.
    - Make pages readable.
    - Keep layout simple.
    - Avoid spending too much time on advanced design.

14. Test the full user flow manually.
    - Create a list.
    - Add movies and insert them into the ranking.
    - View the ranked list.
    - Verify share flow only after the core loop works.

## 11. Risks and Things to Avoid

The main risk is making the MVP too complicated before the core insertion flow works.

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
- A separate random compare page.

Things that could make the MVP harder than necessary:

- Treating add-movie and compare-movie as independent features.
- Choosing random movie pairs instead of comparing the new movie against ranked candidates.
- Trying to make the ranking statistically perfect too early.
- Overengineering the database schema.
- Adding authentication before proving the product interaction is fun.

Existing assumptions to remove:

- The app needs a separate Compare page for random pairs.
- Ranking should start from wins and losses.
- Pairwise comparisons must operate over the whole list before insertion.
- Comparison history is the only source of ranking.
- The `Ranking` table is required for MVP.

The MVP should answer one question:

"Is it useful and enjoyable to rank movies by inserting each new movie into an ordered list through simple comparisons?"

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

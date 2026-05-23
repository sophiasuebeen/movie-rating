# TODO

This project is a beginner-friendly full-stack movie ranking website. Users compare two movies and choose which one they liked better. The app stores pairwise comparisons, creates a ranking, converts it into an approximate 1–10 score, and allows sharing the ranking page with friends.

## 1. Project setup

Task: Initialize the frontend and backend project structure.
Goal: Create a minimal shell for the app so both client and server code can be built independently.
Concern / risk: Overengineering the structure or starting with too many tools will distract from the MVP.
Decision: Use a small React + Vite client and an Express backend with SQLite.
Reason: This keeps the stack beginner-friendly and separates UI from API logic without adding unnecessary complexity.
Definition of Done: `client/` and `server/` folders exist, package managers are initialized, and the repo contains a basic README and project layout.
Suggested git commit message: `chore: initialize project structure for movie ranking app`

## 2. Basic homepage

Task: Build a simple home page that explains the app and points users to the core flow.
Goal: Give users a clear starting point and describe the main interaction.
Concern / risk: Spending too much time polishing the landing page before the app works.
Decision: Keep the home page minimal with a short description, start button, and links to core pages.
Reason: A basic homepage is useful, but the MVP must prioritize core functionality first.
Definition of Done: The home page renders with app name, description, and navigation to add movies, compare, and ranking pages.
Suggested git commit message: `feat: add basic homepage for movie ranking app`

## 3. Movie model / database

Task: Define the database schema and build the backend data layer for movies and comparisons.
Goal: Establish the MVP data model using `MovieList`, `Movie`, and `Comparison`.
Concern / risk: Overengineering the schema or adding tables like `Ranking` too early.
Decision: Keep the schema small and compute rankings dynamically from comparisons.
Reason: Storing only the essential entities keeps the database simple and easy to debug.
Definition of Done: Prisma schema contains `MovieList`, `Movie`, and `Comparison`; migration is applied and the SQLite database is created.
Suggested git commit message: `feat: add Prisma schema for movie lists, movies, and comparisons`

## 4. Add movie form

Task: Build the UI and API connection to add movies to a list.
Goal: Let users enter movie titles and save them.
Concern / risk: Building account or list management before the basic add flow is stable.
Decision: Use a single list per browser session and store the `listId` locally, not auth.
Reason: This avoids unnecessary authentication complexity while preserving a personal list.
Definition of Done: The Add Movie page can create/load a list, submit movie titles, and display the saved movie list.
Suggested git commit message: `feat: implement add movie form and save movies`

## 5. Movie list page

Task: Display the saved movies in the user's list.
Goal: Confirm movies are stored correctly and visible to the user.
Concern / risk: Adding delete/edit controls too early when the core flow is still incomplete.
Decision: Show a read-only list first, with delete as optional later.
Reason: A simple movie list page validates backend persistence without extra UI complexity.
Definition of Done: The movie list page loads movies from the backend and renders them clearly.
Suggested git commit message: `feat: add movie list display page`

## 6. Pairwise comparison page

Task: Build the page that shows two movie choices and records the user's preference.
Goal: Implement the core interaction of comparing two movies.
Concern / risk: Trying to select optimal pairs or use a complex ranking strategy too early.
Decision: Start with two random movies from the list, ensuring they are distinct.
Reason: Random pairwise comparisons are easy to implement and enough to prove the interaction.
Definition of Done: The Compare page fetches two movies and displays two selectable choices.
Suggested git commit message: `feat: add basic compare page with two movie choices`

## 7. Store comparison results

Task: Add the backend route and frontend call to save winner/loser selections.
Goal: Persist pairwise comparison results so ranking can be calculated.
Concern / risk: Accepting invalid comparisons or duplicate pairs without validation.
Decision: Validate that winner and loser IDs differ and belong to the same list.
Reason: Simple validation prevents bad data while keeping the API straightforward.
Definition of Done: When a user selects a winner, the app stores a valid comparison record in the database.
Suggested git commit message: `feat: store pairwise comparison results`

## 8. Ranking algorithm using wins/losses

Task: Calculate movie rankings from comparisons using wins and losses.
Goal: Rank movies simply and reliably for MVP.
Concern / risk: Overcomplicating ranking with Elo or TrueSkill before the app is functional.
Decision: Use wins minus losses to compute a score and sort movies by that score.
Reason: This algorithm is easy to reason about and enough for the initial product.
Definition of Done: Backend ranking service returns movies sorted by score with wins/losses counts.
Suggested git commit message: `feat: add wins/losses ranking algorithm`

## 9. Convert ranking into 1–10 scores

Task: Add approximate score conversion from rank position to a 1–10 range.
Goal: Give users a familiar numeric rating alongside the ranked list.
Concern / risk: Trying to calculate statistical ratings too precisely for MVP.
Decision: Use a linear conversion from rank position to a 1–10 scale.
Reason: It is simple, predictable, and matches the MVP focus on relative preference.
Definition of Done: Ranked movies include an approximate 1–10 rating shown on the ranking page.
Suggested git commit message: `feat: convert ranked positions into approximate 1-10 scores`

## 10. Public share page

Task: Add optional public sharing so friends can view the ranking.
Goal: Provide a read-only page for shared rankings.
Concern / risk: Building sharing and public access before the core app flow is stable.
Decision: Treat sharing as an MVP stretch and add it only after the ranking page works.
Reason: This minimizes scope creep while still preserving the feature for a later step.
Definition of Done: A share slug can be generated and used to load a read-only ranking page.
Suggested git commit message: `feat: add public share route for ranking page`

## 11. Basic UI cleanup

Task: Improve the app's visuals, spacing, and empty states.
Goal: Make the MVP feel polished without adding new functional scope.
Concern / risk: Spending too much time on design instead of core functionality.
Decision: Apply light styling and focus on readability and usability.
Reason: A clean UI makes the prototype more credible without increasing complexity.
Definition of Done: Core pages look organized, empty states are helpful, and the app is easy to use.
Suggested git commit message: `chore: polish UI and add basic empty states`

## 12. Final testing and README update

Task: Validate the full user flow and document how to run the app.
Goal: Ensure the MVP works end to end and can be reproduced by others.
Concern / risk: Missing regressions or leaving the README incomplete.
Decision: Manually test the add/compare/rank flow, then document setup and usage.
Reason: Testing confirms the app delivers its main value, and documentation helps future work.
Definition of Done: Manual flow passes, README includes setup, run instructions, and project overview.
Suggested git commit message: `docs: add final testing notes and README instructions`

# TODO

This project is a beginner-friendly full-stack movie ranking website. Users add a movie they watched, choose a rough preference bucket, and insert the movie into the correct position inside that bucket. The app stores bucket labels and within-bucket positions, builds a full ranked list by combining buckets, converts the result into an approximate 1–10 score, and allows sharing the ranking page with friends.

## 1. Project setup

Task: Initialize the frontend and backend project structure.
Goal: Create a minimal shell for the app so both client and server code can be built independently.
Concern / risk: Overengineering the structure or starting with too many tools will distract from the MVP.
Decision: Use a small React + Vite client and an Express backend with SQLite.
Reason: This keeps the stack beginner-friendly and separates UI from API logic without adding unnecessary complexity.
Definition of Done: `client/` and `server/` folders exist, package managers are initialized, and the repo contains a basic README and project layout.
Suggested git commit message: `chore: initialize project structure for movie ranking app`

## 2. Basic homepage

Task: Build a simple home page that explains the app and points users to the add-and-bucket flow.
Goal: Give users a clear starting point and explain the core interaction.
Concern / risk: Spending too much time polishing the landing page before the app works.
Decision: Keep the home page minimal with a short explanation and links to add movies and view rankings.
Reason: A basic homepage is useful, but the MVP must prioritize the bucket-first flow.
Definition of Done: The home page renders with app name, description, and navigation to Add Movie and Ranking pages.
Suggested git commit message: `feat: add basic homepage for movie ranking app`

## 3. Movie model / database

Task: Define the database schema and build the backend data layer for movies, bucket labels, and within-bucket position.
Goal: Establish the MVP data model using `MovieList`, `Movie`, and `Comparison`.
Concern / risk: Overengineering the schema or adding tables like `Ranking` too early.
Decision: Keep the schema small and include `bucket` plus `position` on `Movie` so bucket-first ordering is easy to maintain.
Reason: These fields make bucketed insertion straightforward and keep the schema beginner-friendly.
Definition of Done: Prisma schema contains `MovieList`, `Movie` with `bucket` and `position`, and `Comparison`; migration is applied and the SQLite database is created.
Suggested git commit message: `feat: add Prisma schema for bucketed ranking and comparisons`

## 4. Add movie flow

Task: Build the UI and API connection for adding a new movie and assigning it to a bucket.
Goal: Let users add a movie, choose its rough preference bucket, and insert it into the correct position inside that bucket.
Concern / risk: Treating add and compare as separate features or comparing the new movie against the entire list.
Decision: Keep bucket selection first, then compare only within that bucket.
Reason: This reduces friction and matches the intended MVP flow.
Definition of Done: The Add Movie page can create/load a list, submit a new movie with a bucket, and begin the within-bucket insertion flow.
Suggested git commit message: `feat: implement add movie bucket selection flow`

## 5. Ranking page

Task: Display the current ranked list and approximate scores.
Goal: Confirm movies are ordered correctly by bucket and within-bucket position.
Concern / risk: Building too many movie management controls before the ranking view is stable.
Decision: Focus on read-only ranked display first, with optional share support later.
Reason: A simple ranking page validates that bucketed ordering works and keeps the UI scope small.
Definition of Done: The Ranking page loads the ordered list and shows titles, buckets, positions, and 1–10 scores.
Suggested git commit message: `feat: add ranking page for bucketed movies`

## 6. Bucketed comparison backend

Task: Add the backend route that records within-bucket comparisons and returns the next candidate.
Goal: Persist each insertion decision and support the bucketed compare flow.
Concern / risk: Accepting invalid comparisons or placing the movie in the wrong bucket.
Decision: Validate that the new movie and the current bucket candidate differ and belong to the same list and bucket.
Reason: Simple validation prevents bad data and keeps the bucketed insertion algorithm consistent.
Definition of Done: The backend stores within-bucket comparison results and returns the next candidate or the final bucket position.
Suggested git commit message: `feat: add bucketed comparison backend route`

## 7. Store comparison results and update bucket ordering

Task: Persist new movie comparisons and insert the movie into the correct bucket position.
Goal: Keep the ranked list accurate after each bucketed insertion.
Concern / risk: Failing to update positions consistently inside a bucket or leaving the list unsorted.
Decision: Update `position` values for affected movies within the selected bucket.
Reason: Maintaining explicit positions simplifies the ranking display and future comparisons.
Definition of Done: A new movie is inserted into the correct bucket position and affected movies in that bucket are shifted as needed.
Suggested git commit message: `feat: persist bucketed comparisons and update positions`

## 8. Ranking algorithm using bucket-first linear insertion

Task: Implement the simplest bucket-first ranking algorithm.
Goal: Rank new movies by letting users choose a bucket and then comparing only inside that bucket.
Concern / risk: Overcomplicating the ranking algorithm before the app is functional.
Decision: Use a linear insertion process inside the selected bucket.
Reason: This is the simplest way to build the intended product flow and keeps comparison friction low.
Definition of Done: The app inserts new movies by bucket and compares them sequentially inside the bucket until the correct position is found.
Suggested git commit message: `feat: add bucket-first linear insertion ranking algorithm`

## 9. Convert ranking into 1–10 scores

Task: Add approximate score conversion from bucketed position to a 1–10 range.
Goal: Give users a familiar score alongside the ordered list.
Concern / risk: Trying to calculate statistical ratings too precisely for MVP.
Decision: Use bucket order and within-bucket position to derive a simple score.
Reason: It is simple, predictable, and matches the MVP focus on broad preference buckets followed by finer placement.
Definition of Done: Ranked movies include an approximate 1–10 rating shown on the ranking page.
Suggested git commit message: `feat: convert bucketed positions into approximate 1-10 scores`

## 10. Public share page

Task: Add optional public sharing so friends can view the ranking.
Goal: Provide a read-only page for shared rankings.
Concern / risk: Building sharing and public access before the core flow is stable.
Decision: Treat sharing as an MVP stretch and add it only after the bucketed flow works.
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
Decision: Manually test the bucketed add/rank flow, then document setup and usage.
Reason: Testing confirms the app delivers its main value, and documentation helps future work.
Definition of Done: Manual flow passes, README includes setup, run instructions, and project overview.
Suggested git commit message: `docs: add final testing notes and README instructions`

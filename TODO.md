# TODO

This project is a beginner-friendly full-stack movie ranking website. Users add a movie they watched and insert it into an existing ranked list by comparing it against ranked candidates. The app stores comparison results, maintains the ranked order, converts positions into an approximate 1–10 score, and allows sharing the ranking page with friends.

## 1. Project setup

Task: Initialize the frontend and backend project structure.
Goal: Create a minimal shell for the app so both client and server code can be built independently.
Concern / risk: Overengineering the structure or starting with too many tools will distract from the MVP.
Decision: Use a small React + Vite client and an Express backend with SQLite.
Reason: This keeps the stack beginner-friendly and separates UI from API logic without adding unnecessary complexity.
Definition of Done: `client/` and `server/` folders exist, package managers are initialized, and the repo contains a basic README and project layout.
Suggested git commit message: `chore: initialize project structure for movie ranking app`

## 2. Basic homepage

Task: Build a simple home page that explains the app and points users to the add-and-insert flow.
Goal: Give users a clear starting point and explain the core interaction.
Concern / risk: Spending too much time polishing the landing page before the app works.
Decision: Keep the home page minimal with a short explanation and links to add movies and view rankings.
Reason: A basic homepage is useful, but the MVP must prioritize the insertion flow first.
Definition of Done: The home page renders with app name, description, and navigation to Add Movie and Ranking pages.
Suggested git commit message: `feat: add basic homepage for movie ranking app`

## 3. Movie model / database

Task: Define the database schema and build the backend data layer for movies, ranking position, and comparisons.
Goal: Establish the MVP data model using `MovieList`, `Movie`, and `Comparison`.
Concern / risk: Overengineering the schema or adding tables like `Ranking` too early.
Decision: Keep the schema small and include `position` on `Movie` so ranked order is easy to maintain.
Reason: A ranked position field makes linear insertion straightforward and keeps the schema beginner-friendly.
Definition of Done: Prisma schema contains `MovieList`, `Movie` with `position`, and `Comparison`; migration is applied and the SQLite database is created.
Suggested git commit message: `feat: add Prisma schema for ranked movies and comparisons`

## 4. Add movie flow

Task: Build the UI and API connection for adding a new movie and inserting it into the rank.
Goal: Let users add a movie and immediately compare it against the existing ranked list if needed.
Concern / risk: Treating add and compare as separate features or building a standalone compare page.
Decision: Keep comparison as part of the add-movie flow and show the new movie against ranked candidates.
Reason: This matches the intended product flow and avoids unnecessary feature separation.
Definition of Done: The Add Movie page can create/load a list, submit a new movie, and begin the insertion comparison flow when existing movies exist.
Suggested git commit message: `feat: implement add movie insertion flow`

## 5. Ranking page

Task: Display the current ranked list and approximate scores.
Goal: Confirm movies are ordered correctly and score conversion is visible.
Concern / risk: Building too many movie management controls before the ranking view is stable.
Decision: Focus on read-only ranked display first, with optional share support later.
Reason: A simple ranking page validates that insertion ordering works and keeps the UI scope small.
Definition of Done: The Ranking page loads the ordered list and shows titles, positions, and 1–10 scores.
Suggested git commit message: `feat: add ranking page for ordered movies`

## 6. Insertion comparison backend

Task: Add the backend route that records a comparison for a new movie and returns the next candidate.
Goal: Persist each insertion decision and support the sequential compare flow.
Concern / risk: Accepting invalid comparisons or misplacing the new movie in the rank.
Decision: Validate that the new movie and the current candidate differ and belong to the same list.
Reason: Simple validation prevents bad data and keeps the insertion algorithm consistent.
Definition of Done: The backend stores insertion comparison results and returns the next ranked movie candidate or the final position.
Suggested git commit message: `feat: add insertion comparison backend route`

## 7. Store comparison results and update ranking

Task: Persist new movie comparisons and insert the movie into the ranked order.
Goal: Keep the ranked list accurate after each insertion comparison.
Concern / risk: Failing to update positions consistently or leaving the list unsorted.
Decision: Update `position` values for affected movies during insertion.
Reason: Maintaining explicit positions simplifies the ranking display and future comparisons.
Definition of Done: A new movie is inserted into the correct ranked position and affected movies are shifted as needed.
Suggested git commit message: `feat: persist comparisons and update ranked positions`

## 8. Ranking algorithm using linear insertion

Task: Implement the simplest insertion-based ranking algorithm.
Goal: Rank new movies by comparing them against ranked candidates one by one.
Concern / risk: Overcomplicating the ranking algorithm before the app is functional.
Decision: Use a linear insertion process starting with the top-ranked movie.
Reason: This is the simplest way to build the intended product flow and makes comparisons easy to explain.
Definition of Done: The app inserts new movies by comparing them sequentially until the correct rank is found.
Suggested git commit message: `feat: add linear insertion ranking algorithm`

## 9. Convert ranking into 1–10 scores

Task: Add approximate score conversion from ranked position to a 1–10 range.
Goal: Give users a familiar score alongside the ordered list.
Concern / risk: Trying to calculate statistical ratings too precisely for MVP.
Decision: Use a linear mapping from rank position to a 1–10 scale.
Reason: It is simple, predictable, and matches the MVP focus on ordered preference.
Definition of Done: Ranked movies include an approximate 1–10 rating shown on the ranking page.
Suggested git commit message: `feat: convert rank positions into approximate 1-10 scores`

## 10. Public share page

Task: Add optional public sharing so friends can view the ranking.
Goal: Provide a read-only page for shared rankings.
Concern / risk: Building sharing and public access before the core flow is stable.
Decision: Treat sharing as an MVP stretch and add it only after the ranked insertion flow works.
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
Decision: Manually test the add/insert/rank flow, then document setup and usage.
Reason: Testing confirms the app delivers its main value, and documentation helps future work.
Definition of Done: Manual flow passes, README includes setup, run instructions, and project overview.
Suggested git commit message: `docs: add final testing notes and README instructions`

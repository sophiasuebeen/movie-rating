-- CreateTable
CREATE TABLE "MovieList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "shareSlug" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bucket" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ranked',
    "listId" TEXT NOT NULL,
    CONSTRAINT "Movie_listId_fkey" FOREIGN KEY ("listId") REFERENCES "MovieList" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comparison" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "listId" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "winnerMovieId" TEXT NOT NULL,
    "loserMovieId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comparison_listId_fkey" FOREIGN KEY ("listId") REFERENCES "MovieList" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comparison_winnerMovieId_fkey" FOREIGN KEY ("winnerMovieId") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comparison_loserMovieId_fkey" FOREIGN KEY ("loserMovieId") REFERENCES "Movie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MovieList_shareSlug_key" ON "MovieList"("shareSlug");

-- CreateTable
CREATE TABLE "Redirect" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "codeSize" INTEGER NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL
);

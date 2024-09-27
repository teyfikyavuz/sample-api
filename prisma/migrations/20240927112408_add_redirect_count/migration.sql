/*
  Warnings:

  - Added the required column `redirectCount` to the `Redirect` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Redirect" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "codeSize" INTEGER NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "redirectCount" INTEGER NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL
);
INSERT INTO "new_Redirect" ("code", "codeSize", "createdAt", "expiresAt", "shortUrl", "url") SELECT "code", "codeSize", "createdAt", "expiresAt", "shortUrl", "url" FROM "Redirect";
DROP TABLE "Redirect";
ALTER TABLE "new_Redirect" RENAME TO "Redirect";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

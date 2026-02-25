-- CreateTable
CREATE TABLE "MetalRatio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "Au" REAL NOT NULL DEFAULT 0,
    "Ag" REAL NOT NULL DEFAULT 0,
    "Pt" REAL NOT NULL DEFAULT 0,
    "Pd" REAL NOT NULL DEFAULT 0,
    "Rh" REAL NOT NULL DEFAULT 0,
    "Ir" REAL NOT NULL DEFAULT 0,
    "Os" REAL NOT NULL DEFAULT 0,
    "Ru" REAL NOT NULL DEFAULT 0,
    "Hg" REAL NOT NULL DEFAULT 0,
    "Cu" REAL NOT NULL DEFAULT 1.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MetalRatioLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "metalRatioId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "note" TEXT,
    "oldValues" TEXT NOT NULL,
    "newValues" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MetalRatioLog_metalRatioId_fkey" FOREIGN KEY ("metalRatioId") REFERENCES "MetalRatio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "BlogLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MetalRatio_date_key" ON "MetalRatio"("date");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

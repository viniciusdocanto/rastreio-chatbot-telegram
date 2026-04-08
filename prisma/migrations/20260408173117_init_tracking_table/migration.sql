-- CreateTable
CREATE TABLE "Tracking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chatId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "lastEventDate" TEXT,
    "userName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tracking_chatId_code_key" ON "Tracking"("chatId", "code");

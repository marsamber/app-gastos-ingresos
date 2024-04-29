/*
  Warnings:

  - You are about to drop the `FixedTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "FixedTransaction";

-- CreateTable
CREATE TABLE "MonthlyTransaction" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "MonthlyTransaction_pkey" PRIMARY KEY ("id")
);

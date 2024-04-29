/*
  Warnings:

  - Added the required column `category` to the `MonthlyTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `MonthlyTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MonthlyTransaction" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MonthlyTransaction" ADD CONSTRAINT "MonthlyTransaction_category_fkey" FOREIGN KEY ("category") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

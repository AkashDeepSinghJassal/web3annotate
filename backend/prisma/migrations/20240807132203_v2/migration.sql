/*
  Warnings:

  - A unique constraint covering the columns `[signature]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "title" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Task_signature_key" ON "Task"("signature");

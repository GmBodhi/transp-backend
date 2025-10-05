/*
  Warnings:

  - Added the required column `theatre_data` to the `shows` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shows" ADD COLUMN     "theatre_data" JSONB NOT NULL;

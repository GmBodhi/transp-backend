-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "assigned_staff" UUID[] DEFAULT ARRAY[]::UUID[];

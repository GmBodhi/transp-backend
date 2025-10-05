-- AlterTable: Add token column to users
ALTER TABLE "users" ADD COLUMN "token" TEXT;
ALTER TABLE "users" ADD CONSTRAINT "users_token_key" UNIQUE ("token");

-- AlterTable: Add user_id column to movies (nullable first to handle existing data)
ALTER TABLE "movies" ADD COLUMN "user_id" UUID;

-- Set default user_id for existing movies to the admin user
UPDATE "movies"
SET "user_id" = (SELECT id FROM "users" WHERE email = 'admin@example.com' LIMIT 1)
WHERE "user_id" IS NULL;

-- Make user_id NOT NULL after setting default values
ALTER TABLE "movies" ALTER COLUMN "user_id" SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE "movies" ADD CONSTRAINT "movies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

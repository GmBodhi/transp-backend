-- CreateTable
CREATE TABLE "shows" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "timestamp" TIMESTAMP(3) NOT NULL,
    "screen" TEXT NOT NULL,
    "theatre" TEXT NOT NULL,
    "movie_id" UUID NOT NULL,
    "distributor_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seat_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "show_id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "booked" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "seat_categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "seat_categories" ADD CONSTRAINT "seat_categories_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

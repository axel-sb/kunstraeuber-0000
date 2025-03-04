-- DropIndex
DROP INDEX "Artwork_style_titles_key";

-- DropIndex
DROP INDEX "Artwork_place_of_origin_key";

-- DropIndex
DROP INDEX "Artwork_artist_title_key";

-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN "latitude" REAL;
ALTER TABLE "Artwork" ADD COLUMN "longitude" REAL;

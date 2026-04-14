-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN     "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "googleMapsUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "instagramUrl" TEXT NOT NULL DEFAULT '';

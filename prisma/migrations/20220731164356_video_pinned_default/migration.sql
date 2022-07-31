-- AlterTable
ALTER TABLE "videos" ALTER COLUMN "pinned" DROP NOT NULL,
ALTER COLUMN "pinned" SET DEFAULT false;

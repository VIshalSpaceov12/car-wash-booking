-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "afterImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "beforeImages" TEXT[] DEFAULT ARRAY[]::TEXT[];

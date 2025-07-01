-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Default Name',
ALTER COLUMN "isEmailVerified" SET DEFAULT true;

-- CreateTable
CREATE TABLE "VehicleIssue" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleIssue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VehicleIssue" ADD CONSTRAINT "VehicleIssue_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleIssue" ADD CONSTRAINT "VehicleIssue_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleIssue" ADD CONSTRAINT "VehicleIssue_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

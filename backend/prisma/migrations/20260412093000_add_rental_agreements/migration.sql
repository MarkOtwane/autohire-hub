-- CreateTable
CREATE TABLE
    "agreement_counters" (
        "year" INTEGER NOT NULL,
        "currentValue" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "agreement_counters_pkey" PRIMARY KEY ("year")
    );

-- CreateTable
CREATE TABLE
    "rental_agreements" (
        "id" TEXT NOT NULL,
        "agreementId" TEXT NOT NULL,
        "clientSubmissionId" TEXT NOT NULL,
        "downloadToken" TEXT NOT NULL,
        "driverName" TEXT NOT NULL,
        "driverEmail" TEXT NOT NULL,
        "driverPhone" TEXT NOT NULL,
        "driverIdNumber" TEXT NOT NULL,
        "driverLicenseNumber" TEXT NOT NULL,
        "emergencyContactName" TEXT NOT NULL,
        "emergencyContactPhone" TEXT NOT NULL,
        "vehicleName" TEXT NOT NULL,
        "vehiclePlateNumber" TEXT,
        "pickupDate" TIMESTAMP(3) NOT NULL,
        "returnDate" TIMESTAMP(3) NOT NULL,
        "pickupLocation" TEXT NOT NULL,
        "returnLocation" TEXT NOT NULL,
        "rentalTermsAccepted" BOOLEAN NOT NULL DEFAULT true,
        "signatureData" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "rental_agreements_pkey" PRIMARY KEY ("id")
    );

-- CreateIndex
CREATE UNIQUE INDEX "rental_agreements_agreementId_key" ON "rental_agreements" ("agreementId");

-- CreateIndex
CREATE UNIQUE INDEX "rental_agreements_clientSubmissionId_key" ON "rental_agreements" ("clientSubmissionId");

-- CreateIndex
CREATE UNIQUE INDEX "rental_agreements_downloadToken_key" ON "rental_agreements" ("downloadToken");
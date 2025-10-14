-- CreateTable
CREATE TABLE "Outbox_Service" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "Outbox_Service_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Outbox_Service" ADD CONSTRAINT "Outbox_Service_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

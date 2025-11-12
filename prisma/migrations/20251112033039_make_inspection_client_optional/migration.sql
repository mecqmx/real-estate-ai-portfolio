-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InspectionRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "preferredDate" DATETIME NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "propertyId" TEXT NOT NULL,
    "clientId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InspectionRequest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InspectionRequest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_InspectionRequest" ("clientId", "createdAt", "email", "id", "message", "name", "phone", "preferredDate", "propertyId", "status", "updatedAt") SELECT "clientId", "createdAt", "email", "id", "message", "name", "phone", "preferredDate", "propertyId", "status", "updatedAt" FROM "InspectionRequest";
DROP TABLE "InspectionRequest";
ALTER TABLE "new_InspectionRequest" RENAME TO "InspectionRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

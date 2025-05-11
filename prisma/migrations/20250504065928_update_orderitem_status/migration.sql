/*
  Warnings:

  - Changed the type of `status` on the `transaction_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderItemStatus" AS ENUM ('IN_CART', 'PENDING', 'PAID', 'CANCELLED');

-- AlterTable
ALTER TABLE "transaction_items" DROP COLUMN "status",
ADD COLUMN     "status" "OrderItemStatus" NOT NULL;

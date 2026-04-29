/*
  Warnings:

  - Made the column `rol` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "rol" SET NOT NULL,
ALTER COLUMN "rol" SET DEFAULT 'user';

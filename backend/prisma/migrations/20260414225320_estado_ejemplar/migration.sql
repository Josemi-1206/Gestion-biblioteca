/*
  Warnings:

  - The `estado` column on the `Ejemplar` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('ESTUDIANTE', 'DOCENTE');

-- CreateEnum
CREATE TYPE "EstadoEjemplar" AS ENUM ('DISPONIBLE', 'PRESTADO');

-- AlterTable
ALTER TABLE "Ejemplar" DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoEjemplar" NOT NULL DEFAULT 'DISPONIBLE';

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoUsuario" NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

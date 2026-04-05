-- CreateTable
CREATE TABLE "Estudiante" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "programaId" INTEGER NOT NULL,

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Docente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,

    CONSTRAINT "Docente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramaAcademico" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "ProgramaAcademico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asignatura" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "programaId" INTEGER NOT NULL,

    CONSTRAINT "Asignatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeriodoAcademico" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "PeriodoAcademico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsignacionDocente" (
    "id" SERIAL NOT NULL,
    "docenteId" INTEGER NOT NULL,
    "asignaturaId" INTEGER NOT NULL,
    "periodoAcademicoId" INTEGER NOT NULL,

    CONSTRAINT "AsignacionDocente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matricula" (
    "id" SERIAL NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "asignacionDocenteId" INTEGER NOT NULL,

    CONSTRAINT "Matricula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calificacion" (
    "id" SERIAL NOT NULL,
    "matriculaId" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_correo_key" ON "Estudiante"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_correo_key" ON "Docente"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramaAcademico_nombre_key" ON "ProgramaAcademico"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "PeriodoAcademico_nombre_key" ON "PeriodoAcademico"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "AsignacionDocente_docenteId_asignaturaId_periodoAcademicoId_key" ON "AsignacionDocente"("docenteId", "asignaturaId", "periodoAcademicoId");

-- CreateIndex
CREATE UNIQUE INDEX "Matricula_estudianteId_asignacionDocenteId_key" ON "Matricula"("estudianteId", "asignacionDocenteId");

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_programaId_fkey" FOREIGN KEY ("programaId") REFERENCES "ProgramaAcademico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignatura" ADD CONSTRAINT "Asignatura_programaId_fkey" FOREIGN KEY ("programaId") REFERENCES "ProgramaAcademico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionDocente" ADD CONSTRAINT "AsignacionDocente_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionDocente" ADD CONSTRAINT "AsignacionDocente_asignaturaId_fkey" FOREIGN KEY ("asignaturaId") REFERENCES "Asignatura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionDocente" ADD CONSTRAINT "AsignacionDocente_periodoAcademicoId_fkey" FOREIGN KEY ("periodoAcademicoId") REFERENCES "PeriodoAcademico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_asignacionDocenteId_fkey" FOREIGN KEY ("asignacionDocenteId") REFERENCES "AsignacionDocente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_matriculaId_fkey" FOREIGN KEY ("matriculaId") REFERENCES "Matricula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

# 📚 Sistema de Gestión de Biblioteca Digital

## 📖 Descripción del Proyecto
El **Sistema de Gestión de Biblioteca Digital** es una plataforma web diseñada para modernizar el proceso de administración de una biblioteca académica.  
Permite gestionar el catálogo bibliográfico, préstamos, devoluciones, reservas y multas de manera eficiente, ofreciendo a bibliotecarios y usuarios una experiencia ágil y confiable.

Actualmente, el proceso manual genera problemas como búsquedas lentas, control deficiente de devoluciones y multas sin cobrar. Este sistema busca resolver dichos inconvenientes mediante una solución tecnológica integral.

---

## 🛠️ Tecnologías Utilizadas
- **Backend:** [NestJS](https://nestjs.com/)  
- **Frontend:** [Next.js](https://nextjs.org/)  
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)  
- **ORM:** [Prisma](https://www.prisma.io/)  
- **Contenedores:** [Docker](https://www.docker.com/)  

---

## 🚀 Plan de Releases

### Release 1 - Backend y Frontend Base
- **Objetivo:** API REST completa y frontend CRUD.
- **Sprints:**
  - **Sprint 1 (Mar 16 - Mar 29):** Infraestructura, Docker, Prisma, CRUD de Libro/Autor/Categoría.  
  - **Sprint 2 (Mar 30 - Abr 10):** Gestión de UsuarioLector y Ejemplar con validaciones.  
  - **Sprint 3 (Abr 13 - Abr 17):** Préstamos, devoluciones y frontend base.  

### Release 2 - Integración y Funcionalidades
- **Objetivo:** Integración completa, reservas, multas y reportes.
- **Sprints:**
  - **Sprint 4 (Abr 20 - May 8):** Reservas, búsqueda avanzada, integración frontend-backend.  
  - **Sprint 5 (May 11 - May 22):** Multas automáticas, reportes y pruebas E2E.  

---

## 📌 Historias de Usuario Principales
- **HU-01:** Gestión de Libros (CRUD con ISBN único).  
- **HU-02:** Gestión de Autores.  
- **HU-03:** Gestión de Categorías.  
- **HU-04:** Gestión de Usuarios Lectores (con límites de préstamos según tipo).  
- **HU-05:** Gestión de Ejemplares (estado: disponible/prestado).  
- **HU-07:** Préstamo de Libros (validación de disponibilidad y límites).  
- **HU-08:** Devolución de Libros (cálculo de mora).  
- **HU-10:** Multas Automáticas (valor por día de retraso).  
- **HU-11:** Búsqueda de Libros (por título, autor, categoría o ISBN).  
- **HU-12:** Reservas de Libros.  
- **HU-13:** Historial de Préstamos.  
- **HU-14:** Reportes del Sistema (libros más prestados, usuarios con multas).  

---

## ✅ Definition of Done (DoD)
Una historia de usuario se considera finalizada cuando:
- **Backend:**  
  - Endpoints desarrollados con estructura modular (Controller → Service → Repository).  
  - DTOs con validaciones.  
  - Manejo global de errores HTTP.  
  - Respuestas con formato estándar.  
  - Lógica de negocio implementada (disponibilidad, límites, multas, reservas).  
  - Verificación con Postman/Thunder Client.  

- **Frontend:**  
  - Vistas con componentes reutilizables.  
  - Consumo correcto de servicios backend.  
  - Manejo de estados (carga, éxito, error).  
  - Formularios con validaciones.  
  - Tablas y listados con datos relevantes.  
  - Interfaz adaptable y navegación fluida.  

- **Infraestructura:**  
  - Proyecto versionado en repositorio.  
  - Ejecución mediante Docker.  
  - Migraciones consistentes en base de datos.  
  - Variables de entorno configuradas.  

---

## 🗂️ Modelo de Entidades (Prisma)

### Relaciones principales
- **Libro 1 - N Ejemplar**  
- **Libro N - N Autor**  
- **Categoría 1 - N Libro**  
- **Usuario 1 - N Préstamo**  
- **Préstamo 1 - 1 Multa**  
- **Préstamo 1 - 1 Devolución**  
- **Usuario 1 - N Reserva**  
- **Libro 1 - N Reserva**

### Entidades
- **Libro:** id, isbn, título, editorial, año, categoriaId  
- **Autor:** id, nombre, biografía, nacionalidad  
- **Categoría:** id, nombre (único)  
- **Ejemplar:** id, libroId, estado  
- **UsuarioLector:** id, nombre, tipo, limitePrestamos  
- **Préstamo:** id, usuarioId, ejemplarId, fechas (préstamo, devolución esperada, devolución real)  
- **Multa:** id, prestamoId (único), valor, díasRetraso, estado  
- **Reserva:** id, usuarioId, libroId, fechaReserva, estado  

---

## 👥 Autores
- José Miguel Aya Peralta  
- Andrés Felipe Calle González  

---

## 📌 Contexto del Proyecto
La biblioteca de una institución educativa busca modernizar su sistema de gestión de préstamos y catálogo de libros.  
El sistema permitirá:  
- Registrar libros físicos y digitales.  
- Gestionar autores y categorías.  
- Controlar préstamos y devoluciones.  
- Generar multas automáticas por mora.  
- Realizar búsquedas avanzadas y reservas.  
- Consultar historial de préstamos.  
- Generar reportes de uso del sistema.  

---

## 🚀 Ejecución del Proyecto
1. Clonar el repositorio.  
2. Configurar variables de entorno (`.env`).  
3. Ejecutar migraciones de Prisma.  
4. Levantar contenedores con Docker.  
5. Acceder al frontend en el navegador.  

---

## 📊 Estado del Proyecto
- **Release 1:** En desarrollo.  
- **Release 2:** Planificado.  


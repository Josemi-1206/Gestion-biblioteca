# 📚 Sistema de Gestión de Biblioteca Digital

## 📖 Descripción del Proyecto
El Sistema de Gestión de Biblioteca Digital es una plataforma web diseñada para modernizar el proceso de administración de una biblioteca académica.  
Permite gestionar el catálogo bibliográfico, préstamos, devoluciones, reservas y multas de manera eficiente, ofreciendo a bibliotecarios y usuarios una experiencia ágil y confiable.

Actualmente, el proceso manual genera problemas como búsquedas lentas, control deficiente de devoluciones y multas sin cobrar. Este sistema busca resolver dichos inconvenientes mediante una solución tecnológica integral.

---

## 🛠️ Tecnologías Utilizadas
- **Backend:** NestJS  
- **Frontend:** Next.js  
- **Base de Datos:** PostgreSQL  
- **ORM:** Prisma  
- **Contenedores:** Docker  

---

## 🚀 Plan de Releases

### Release 1 - Backend y Frontend Base
**Objetivo:** Construir la API REST completa con arquitectura en capas + frontend con CRUD de entidades principales del sistema bibliotecario.

- **Sprint 1 (Mar 18 - Mar 29):** Infraestructura, Docker, Prisma, CRUD Libro/Autor/Categoría.  
- **Sprint 2 (Mar 30 - Abr 10):** UsuarioLector, Ejemplar, validaciones.  
- **Sprint 3 (Abr 13 - Abr 17):** Préstamos, devoluciones.  

### Release 2 - Integración y Funcionalidades
**Objetivo:** Integración completa frontend + backend, lógica avanzada (multas, reservas).

- **Sprint 4 (Abr 20 - May 8):** Base, Multas automáticas, Integración frontend-backend.  
- **Sprint 5 (May 11 - May 22):** Reservas, Pruebas E2E.  

---

## 📌 Historias de Usuario Principales
- **HU-01:** Gestión de Libros (CRUD con ISBN único).  
- **HU-02:** Gestión de Autores.  
- **HU-03:** Gestión de Categorías.  
- **HU-04:** Gestión de Usuarios Lectores (con límites de préstamos según tipo).  
- **HU-05:** Gestión de Ejemplares (estado: disponible/prestado).  
- **HU-06:** Préstamo de Libros (validación de disponibilidad y límites).  
- **HU-07:** Devolución de Libros (cálculo de mora).  
- **HU-08:** Frontend Base (formularios, listados, estados).  
- **HU-09:** Multas Automáticas (valor por día de retraso).  
- **HU-10:** Reservas de Libros.  

---

## ✅ Definition of Done (DoD)
Una historia de usuario se considera finalizada cuando:

### Backend
- Endpoints desarrollados con estructura modular (Controller → Service → Repository).  
- DTOs con validaciones.  
- Manejo global de errores HTTP.  
- Respuestas con formato estándar.  
- Lógica de negocio implementada (disponibilidad, límites, multas, reservas).  
- Verificación con Postman/Thunder Client.  

### Frontend
- Vistas con componentes reutilizables.  
- Consumo correcto de servicios backend.  
- Manejo de estados (carga, éxito, error).  
- Formularios con validaciones.  
- Tablas y listados con datos relevantes.  
- Interfaz adaptable y navegación fluida.  

### Infraestructura
- Proyecto versionado en repositorio.  
- Ejecución mediante Docker.  
- Migraciones consistentes en base de datos.  
- Variables de entorno configuradas.  

---

## 🗂️ Modelo de Entidades (Prisma)

### Relaciones principales
- Libro **1 - N** Ejemplar  
- Libro **N - N** Autor  
- Categoría **1 - N** Libro  
- Usuario **1 - N** Préstamo  
- Préstamo **1 - 1** Multa  
- Préstamo **1 - 1** Devolución  
- Usuario **1 - N** Reserva  
- Libro **1 - N** Reserva  

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
- **José Miguel Aya Peralta**  
- **Andrés Felipe Calle González**

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
1. Clonar el repositorio:  
   ```bash
   git clone https://github.com/Josemi-1206/Gestion-biblioteca.git

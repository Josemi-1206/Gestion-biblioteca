import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LibrosModule } from './modules/libros/libros.module';
import { AutoresModule } from './modules/autores/autores.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { EjemplaresModule } from './modules/ejemplares/ejemplares.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PrestamosModule } from './modules/prestamos/prestamos.module';
import { MultasModule } from './modules/multas/multas.module';
import { ReservasModule } from './modules/reservas/reservas.module';

@Module({
  imports: [PrismaModule, LibrosModule, AutoresModule, CategoriasModule, EjemplaresModule, UsuariosModule, PrestamosModule, MultasModule, ReservasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
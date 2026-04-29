import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from '../../infraestructura/database/prisma.service';
import { RolesGuard } from '../../core/guards/roles.guard';

@Module({
  controllers: [UsuariosController],
  providers: [
    UsuariosService,
    PrismaService,
    RolesGuard, // 🔥 IMPORTANTE
  ],
})
export class UsuariosModule {}
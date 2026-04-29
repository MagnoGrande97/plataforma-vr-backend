import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UsuarioActual } from '../../core/decoradores/usuario.decorador';

import { Roles } from '../../core/decoradores/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';

import { PrismaService } from '../../infraestructura/database/prisma.service';
import { UsuarioRepositoryPrisma } from '../../infraestructura/usuario/usuario.repository.prisma';
import { SincronizarUsuarioUseCase } from '../../aplicacion/usuario/sincronizar-usuario.usecase';

@Controller('usuarios')
export class UsuariosController {
  private repo: UsuarioRepositoryPrisma;
  private useCase: SincronizarUsuarioUseCase;

  constructor(private prisma: PrismaService) {
    this.repo = new UsuarioRepositoryPrisma(this.prisma);
    this.useCase = new SincronizarUsuarioUseCase(this.repo);
  }

  // 🔹 LOGIN + SINCRONIZA USUARIO
  @UseGuards(JwtAuthGuard)
  @Get()
  async obtenerUsuarios(@UsuarioActual() usuarioToken) {
    const usuario = await this.useCase.ejecutar(usuarioToken);

    return {
      mensaje: 'Usuario sincronizado',
      usuario,
    };
  }

  // 🔹 PERFIL (usuario actual)
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async perfil(@UsuarioActual() usuarioToken) {
    return this.repo.buscarPorAuth0Id(usuarioToken.sub);
  }

  // 🔥 NUEVA RUTA ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  adminOnly() {
    return { mensaje: 'Solo admin' };
  }

  // 🔹 TEST
  @Get('test')
  test() {
    return { ok: true };
  }
}
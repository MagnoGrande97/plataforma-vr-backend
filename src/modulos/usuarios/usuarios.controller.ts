import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UsuarioActual } from '../../core/decoradores/usuario.decorador';

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

  @UseGuards(JwtAuthGuard)
  @Get()
  async obtenerUsuarios(@UsuarioActual() usuarioToken) {
    const usuario = await this.useCase.ejecutar(usuarioToken);

    return {
      mensaje: 'Usuario sincronizado',
      usuario,
    };
  }

  // 🔥 NUEVO ENDPOINT
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async perfil(@UsuarioActual() usuarioToken) {
    return this.repo.buscarPorAuth0Id(usuarioToken.sub);
  }

  @Get('test')
  test() {
    return { ok: true };
  }
}
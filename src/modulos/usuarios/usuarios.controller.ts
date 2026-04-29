import {
  Controller,
  Get,
  UseGuards,
  Put,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';

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

  // 🔹 PERFIL
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async perfil(@UsuarioActual() usuarioToken) {
    return this.repo.buscarPorAuth0Id(usuarioToken.sub);
  }

  // 🔹 EDITAR PERFIL
  @UseGuards(JwtAuthGuard)
  @Put('perfil')
  async actualizarPerfil(
    @UsuarioActual() usuarioToken,
    @Body() body: { nombre?: string }
  ) {
    return this.repo.actualizarPorAuth0Id(usuarioToken.sub, body);
  }

  // 🔥 ADMIN TEST
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  adminOnly() {
    return { mensaje: 'Solo admin' };
  }

  // =========================
  // 🔥 CRUD USUARIOS (ADMIN)
  // =========================

  // 🔹 LISTAR SOLO DE SU EMPRESA
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('todos')
  async listarUsuarios(
    @UsuarioActual() usuarioToken,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    const usuario = await this.repo.buscarPorAuth0Id(usuarioToken.sub);

    return this.prisma.usuario.findMany({
      where: {
        institucionId: usuario?.institucionId ?? undefined,
        activo: true,
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { creadoEn: 'desc' },
    });
  }

  // 🔹 VER UNO
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  async obtenerUsuario(@Param('id') id: string) {
    return this.repo.buscarPorId(id);
  }

  // 🔹 ACTUALIZAR
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async actualizarUsuario(
    @Param('id') id: string,
    @Body()
    body: {
      nombre?: string;
      rol?: string;
    }
  ) {
    return this.repo.actualizarPorId(id, body);
  }

  // 🔥 ELIMINAR (SOFT DELETE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async eliminarUsuario(@Param('id') id: string) {
    return this.repo.eliminarPorId(id);
  }

  // 🔹 TEST
  @Get('test')
  test() {
    return { ok: true };
  }
}
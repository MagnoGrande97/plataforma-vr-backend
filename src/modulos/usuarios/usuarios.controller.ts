import {
  Controller,
  Get,
  UseGuards,
  Put,
  Body,
  Param,
  Patch,
  Delete,
  Post,
  Query,
  BadRequestException,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UsuarioActual } from '../../core/decoradores/usuario.decorador';

import { Roles } from '../../core/decoradores/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';

import { PrismaService } from '../../infraestructura/database/prisma.service';
import { UsuarioRepositoryPrisma } from '../../infraestructura/usuario/usuario.repository.prisma';
import { SincronizarUsuarioUseCase } from '../../aplicacion/usuario/sincronizar-usuario.usecase';

import { EmailService } from '../../infraestructura/email/email.service';

@Controller('usuarios')
export class UsuariosController {
  private repo: UsuarioRepositoryPrisma;
  private useCase: SincronizarUsuarioUseCase;
  private emailService: EmailService;

  constructor(private prisma: PrismaService) {
    this.repo = new UsuarioRepositoryPrisma(this.prisma);
    this.useCase = new SincronizarUsuarioUseCase(this.repo);
    this.emailService = new EmailService();
  }

  // =========================
  // 🔹 AUTH / PERFIL
  // =========================

  @UseGuards(JwtAuthGuard)
  @Get()
  async obtenerUsuarios(@UsuarioActual() usuarioToken: any) {
    const usuario = await this.useCase.ejecutar(usuarioToken);

    return {
      mensaje: 'Usuario sincronizado',
      usuario,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  async perfil(@UsuarioActual() usuarioToken: any) {
    const usuario = await this.repo.buscarPorAuth0Id(usuarioToken.sub);

    if (!usuario) {
      return this.useCase.ejecutar(usuarioToken);
    }

    return usuario;
  }

  @UseGuards(JwtAuthGuard)
  @Put('perfil')
  async actualizarPerfil(
    @UsuarioActual() usuarioToken: any,
    @Body() body: { nombre?: string }
  ) {
    return this.repo.actualizarPorAuth0Id(usuarioToken.sub, body);
  }

  // =========================
  // 🔥 ADMIN
  // =========================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  adminOnly() {
    return { mensaje: 'Solo admin' };
  }

  // =========================
  // 🔥 CRUD USUARIOS
  // =========================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('todos')
  async listarUsuarios(
    @UsuarioActual() usuarioToken: any,
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  async obtenerUsuario(@Param('id') id: string) {
    return this.repo.buscarPorId(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async actualizarUsuario(
    @Param('id') id: string,
    @Body() body: { nombre?: string; rol?: string }
  ) {
    return this.repo.actualizarPorId(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async eliminarUsuario(@Param('id') id: string) {
    return this.repo.eliminarPorId(id);
  }

  // =========================
  // 🔥 INVITAR USUARIO (FIX REAL)
  // =========================

  @Post('invitar')
  async invitarUsuario(
    @UsuarioActual() usuarioToken: any,
    @Body() body: { email: string; nombre: string }
  ) {
    console.log('📩 INVITAR REQUEST:', body);

    try {
      const admin = await this.repo.buscarPorAuth0Id(usuarioToken.sub);

      if (!admin) {
        console.error('❌ Admin no encontrado');
        throw new BadRequestException('Admin no encontrado');
      }

      // 🔥 VALIDAR DUPLICADO
      const existente = await this.repo.buscarPorEmail(body.email);

      if (existente) {
        console.warn('⚠️ Usuario ya existe:', body.email);

        return {
          mensaje: 'Usuario ya existe',
          usuario: existente,
        };
      }

      // 🔥 CREAR USUARIO
      const usuario = await this.repo.crearPorAdmin({
        email: body.email,
        nombre: body.nombre,
        institucionId: admin.institucionId!,
      });

      console.log('✅ Usuario creado:', usuario.email);

      // 🔥 EMAIL (NO ROMPER FLUJO)
      try {
        const emailResponse = await this.emailService.enviarInvitacion(
          body.email,
          body.nombre
        );

        console.log('📨 Email enviado:', emailResponse);
      } catch (emailError) {
        console.error('❌ Error enviando email:', emailError);

        // 🔥 NO lanzar error → evitar 500
        return {
          mensaje: 'Usuario creado pero email falló',
          usuario,
          warning: 'EMAIL_FAILED',
        };
      }

      return {
        mensaje: 'Usuario creado e invitación enviada',
        usuario,
      };

    } catch (error) {
      console.error('🔥 ERROR INVITAR:', error);

      throw new BadRequestException(
        error?.message || 'Error invitando usuario'
      );
    }
  }

  // =========================
  // 🔹 TEST
  // =========================

  @Get('test')
  test() {
    return { ok: true };
  }
}
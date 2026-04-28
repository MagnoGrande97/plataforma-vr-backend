import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { UsuarioActual } from '../../core/decoradores/usuario.decorador';
import { UsuarioRepositoryMemory } from '../../infraestructura/usuario/usuario.repository.memory';
import { SincronizarUsuarioUseCase } from '../../aplicacion/usuario/sincronizar-usuario.usecase';

@Controller('usuarios')
export class UsuariosController {
  private repo = new UsuarioRepositoryMemory();
  private useCase = new SincronizarUsuarioUseCase(this.repo);

  @UseGuards(JwtAuthGuard)
  @Get()
  async obtenerUsuarios(@UsuarioActual() usuarioToken) {
    const usuario = await this.useCase.ejecutar(usuarioToken);

    return {
      mensaje: 'Usuario sincronizado',
      usuario,
    };
  }
}

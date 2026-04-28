import { Controller, Get } from '@nestjs/common';

@Controller('usuarios')
export class UsuariosController {
  @Get()
  obtenerUsuarios() {
    return {
      mensaje: 'Usuario simulado',
      usuario: {
        id: '123',
        email: 'test@test.com',
        nombre: 'Usuario Demo',
      },
    };
  }
}
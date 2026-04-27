import { Controller, Get } from '@nestjs/common';

@Controller('usuarios')
export class UsuariosController {
  @Get()
  obtenerUsuarios() {
    return [
      {
        id: 1,
        nombre: 'Usuario Demo',
      },
    ];
  }
}

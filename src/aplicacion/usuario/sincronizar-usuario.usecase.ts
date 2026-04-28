import { UsuarioRepository } from './usuario.repository';
import { Usuario } from '../../dominio/usuario/usuario.entity';

export class SincronizarUsuarioUseCase {
  constructor(private repo: UsuarioRepository) {}

  async ejecutar(data: any): Promise<Usuario> {
    let usuario = await this.repo.buscarPorAuth0Id(data.usuarioId);

    if (!usuario) {
      usuario = {
        id: Date.now().toString(),
        auth0Id: data.usuarioId,
        email: data.email,
        nombre: data.nombre,
        creadoEn: new Date(),
      };
      await this.repo.crear(usuario);
    }

    return usuario;
  }
}
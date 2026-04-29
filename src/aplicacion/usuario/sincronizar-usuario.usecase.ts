import { UsuarioRepository } from './usuario.repository';
import { Usuario } from '../../dominio/usuario/usuario.entity';

export class SincronizarUsuarioUseCase {
  constructor(private repo: UsuarioRepository) {}

  async ejecutar(payload: any): Promise<Usuario> {
    // 🔥 Validación real del token
    if (!payload || !payload.sub) {
      throw new Error('Token inválido');
    }

    const auth0Id = payload.sub;
    const email = payload.email ?? '';
    const nombre = payload.name || payload.nickname || '';

    let usuario = await this.repo.buscarPorAuth0Id(auth0Id);

    if (!usuario) {
      usuario = await this.repo.crear({
        auth0Id,
        email,
        nombre,
      });
    }

    return usuario;
  }
}
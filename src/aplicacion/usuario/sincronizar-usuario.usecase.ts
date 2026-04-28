import { UsuarioRepository } from './usuario.repository';
import { Usuario } from '../../dominio/usuario/usuario.entity';
import { randomUUID } from 'crypto';

export class SincronizarUsuarioUseCase {
  constructor(private repo: UsuarioRepository) {}

  async ejecutar(data: any): Promise<Usuario> {
    // 🔥 Validación crítica
    if (!data || !data.usuarioId) {
      throw new Error('Token inválido o vacío');
    }

    let usuario = await this.repo.buscarPorAuth0Id(data.usuarioId);

    if (!usuario) {
      usuario = {
        id: randomUUID(), // ✅ FIX PRO
        auth0Id: data.usuarioId,
        email: data.email ?? '',
        nombre: data.nombre ?? '',
        creadoEn: new Date(),
      };

      await this.repo.crear(usuario);
    }

    return usuario;
  }
}
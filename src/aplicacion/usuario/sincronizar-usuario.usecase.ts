import { UsuarioRepository } from './usuario.repository';
import { Usuario } from '../../dominio/usuario/usuario.entity';
import { randomUUID } from 'crypto';

export class SincronizarUsuarioUseCase {
  constructor(private repo: UsuarioRepository) {}

  async ejecutar(data: any): Promise<Usuario> {
    if (!data || !data.sub) {
      throw new Error('Token inválido');
    }

    // ✅ USAR EL NAMESPACE CORRECTO
    const email = data['https://prometeo.com/email'];
    const nombre = data['https://prometeo.com/name'];

    let usuario = await this.repo.buscarPorAuth0Id(data.sub);

    if (!usuario) {
      usuario = {
        id: randomUUID(),
        auth0Id: data.sub,
        email: email ?? '',
        nombre: nombre ?? email ?? '',
        creadoEn: new Date(),
      };

      await this.repo.crear(usuario);
    }

    return usuario;
  }
}
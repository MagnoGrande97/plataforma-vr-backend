import { UsuarioRepository } from './usuario.repository';
import { Usuario } from '../../dominio/usuario/usuario.entity';

export class SincronizarUsuarioUseCase {
  constructor(private repo: UsuarioRepository) {}

  async ejecutar(data: any): Promise<Usuario> {
    if (!data || !data.sub) {
      throw new Error('Token inválido');
    }

    const email = data['https://prometeo.com/email'] ?? '';
    const nombre = data['https://prometeo.com/name'] ?? email;

    // 🔥 1. BUSCAR POR AUTH0
    let usuario = await this.repo.buscarPorAuth0Id(data.sub);

    if (usuario) return usuario;

    // 🔥 2. BUSCAR POR EMAIL (INVITADO)
    const usuarioPorEmail = await this.repo.buscarPorEmail(email);

    if (usuarioPorEmail) {
      // 🔥 LINKEAR CUENTA
      await this.repo.actualizarPorId(usuarioPorEmail.id, {
        auth0Id: data.sub,
      });

      return this.repo.buscarPorId(usuarioPorEmail.id);
    }

    // 🔥 3. CREAR NUEVO
    const institucion = await this.repo.crearInstitucion({
      nombre: email || 'Empresa',
    });

    await this.repo.crear({
      auth0Id: data.sub,
      email,
      nombre,
      institucionId: institucion.id,
    });

    return this.repo.buscarPorAuth0Id(data.sub);
  }
}
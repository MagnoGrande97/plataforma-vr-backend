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

    // 🔥 1. buscar por auth0
    let usuario = await this.repo.buscarPorAuth0Id(data.sub);
    if (usuario) return usuario;

    // 🔥 2. buscar por email (INVITADO)
    const usuarioPorEmail = await this.repo.buscarPorEmail(email);

    if (usuarioPorEmail) {
      await this.repo.actualizarPorId(usuarioPorEmail.id, {
        auth0Id: data.sub,
      });

      const actualizado = await this.repo.buscarPorId(usuarioPorEmail.id);
      if (!actualizado) throw new Error('Error vinculando usuario');

      return actualizado;
    }

    // 🔥 3. crear nuevo usuario
    const institucion = await this.repo.crearInstitucion({
      nombre: email || 'Empresa',
    });

    await this.repo.crear({
      auth0Id: data.sub,
      email,
      nombre,
      institucionId: institucion.id,
    });

    const nuevo = await this.repo.buscarPorAuth0Id(data.sub);
    if (!nuevo) throw new Error('Error creando usuario');

    return nuevo;
  }
}
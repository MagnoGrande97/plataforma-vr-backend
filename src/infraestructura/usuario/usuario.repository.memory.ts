import { Usuario } from '../../dominio/usuario/usuario.entity';
import { UsuarioRepository } from '../../aplicacion/usuario/usuario.repository';

export class UsuarioRepositoryMemory implements UsuarioRepository {
  private usuarios: Usuario[] = [];

  async buscarPorAuth0Id(auth0Id: string): Promise<Usuario | null> {
    return this.usuarios.find(u => u.auth0Id === auth0Id) || null;
  }

  async crear(usuario: Usuario): Promise<Usuario> {
    this.usuarios.push(usuario);
    return usuario;
  }
}
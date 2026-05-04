import { Usuario } from '../../dominio/usuario/usuario.entity';
import { UsuarioRepository } from '../../aplicacion/usuario/usuario.repository';

export class UsuarioRepositoryMemory implements UsuarioRepository {
  private usuarios: Usuario[] = [];

  async buscarPorAuth0Id(auth0Id: string): Promise<Usuario | null> {
    return this.usuarios.find(u => u.auth0Id === auth0Id) || null;
  }

  async crearInstitucion(data: { nombre: string }): Promise<any> {
    return { id: 'memory-institucion' };
  }

  async crear(data: {
    auth0Id: string;
    email: string;
    nombre: string;
    institucionId?: string;
  }): Promise<Usuario> {
    const usuario: Usuario = {
      id: Date.now().toString(),
      creadoEn: new Date(),
      ...data,
    };

    this.usuarios.push(usuario);
    return usuario;
  }

  async actualizarPorAuth0Id(
    auth0Id: string,
    data: { nombre?: string }
  ): Promise<Usuario> {
    const usuario = this.usuarios.find(u => u.auth0Id === auth0Id);
    if (!usuario) throw new Error('Usuario no encontrado');

    if (data.nombre !== undefined) usuario.nombre = data.nombre;

    return usuario;
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.usuarios.find(u => u.id === id) || null;
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.usuarios.find(u => u.email === email) || null;
  }

  async actualizarPorId(id: string, data: any): Promise<Usuario> {
    const usuario = this.usuarios.find(u => u.id === id);
    if (!usuario) throw new Error('Usuario no encontrado');

    Object.assign(usuario, data);
    return usuario;
  }

  async eliminarPorId(id: string): Promise<Usuario> {
    const usuario = this.usuarios.find(u => u.id === id);
    if (!usuario) throw new Error('Usuario no encontrado');

    usuario.activo = false;
    return usuario;
  }
}
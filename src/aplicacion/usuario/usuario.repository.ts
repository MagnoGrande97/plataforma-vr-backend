import { Usuario } from '../../dominio/usuario/usuario.entity';

export interface UsuarioRepository {
  buscarPorAuth0Id(auth0Id: string): Promise<Usuario | null>;

  crearInstitucion(data: { nombre: string }): Promise<any>;

  crear(data: {
    auth0Id: string;
    email: string;
    nombre: string;
    institucionId?: string;
  }): Promise<Usuario>;

  actualizarPorAuth0Id(
    auth0Id: string,
    data: {
      nombre?: string;
    }
  ): Promise<Usuario>;

  buscarPorId(id: string): Promise<Usuario | null>;

  actualizarPorId(
    id: string,
    data: {
      nombre?: string;
      rol?: string;
    }
  ): Promise<Usuario>;

  eliminarPorId(id: string): Promise<Usuario>;
}
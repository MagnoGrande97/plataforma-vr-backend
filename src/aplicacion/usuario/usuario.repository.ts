import { Usuario } from '../../dominio/usuario/usuario.entity';

export interface UsuarioRepository {
  buscarPorAuth0Id(auth0Id: string): Promise<Usuario | null>;

  crear(data: {
    auth0Id: string;
    email: string;
    nombre: string;
  }): Promise<Usuario>;
}
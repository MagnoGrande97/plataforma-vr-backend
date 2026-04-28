import { Usuario } from '../../dominio/usuario/usuario.entity';

export interface UsuarioRepository {
  buscarPorAuth0Id(auth0Id: string): Promise<Usuario | null>;
  crear(usuario: Usuario): Promise<Usuario>;
}
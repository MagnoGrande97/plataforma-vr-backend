import { UsuarioRepository } from '../../aplicacion/usuario/usuario.repository';
import { Usuario } from '../../dominio/usuario/usuario.entity';
import { PrismaService } from '../database/prisma.service';

export class UsuarioRepositoryPrisma implements UsuarioRepository {
  constructor(private prisma: PrismaService) {}

  async buscarPorAuth0Id(auth0Id: string) {
    return this.prisma.usuario.findUnique({
      where: { auth0Id },
    });
  }

  async crear(data: {
    auth0Id: string;
    email: string;
    nombre: string;
  }) {
    return this.prisma.usuario.create({
      data,
    });
  }
}
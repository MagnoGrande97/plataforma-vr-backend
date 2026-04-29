import { UsuarioRepository } from '../../aplicacion/usuario/usuario.repository';
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

  async actualizarPorAuth0Id(auth0Id: string, data: any) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { auth0Id },
    });

    if (!usuario) {
      throw new Error('Usuario no existe');
    }

    return this.prisma.usuario.update({
      where: { auth0Id },
      data,
    });
  }

  async listarTodos() {
    return this.prisma.usuario.findMany({
      orderBy: { creadoEn: 'desc' },
    });
  }

  async buscarPorId(id: string) {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  async actualizarPorId(id: string, data: {
    nombre?: string;
    institucionId?: string;
    rol?: string;
  }) {
    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  async eliminarPorId(id: string) {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}
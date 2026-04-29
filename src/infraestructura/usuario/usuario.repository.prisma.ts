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
    institucionId?: string;
  }) {
    return this.prisma.usuario.create({
      data,
    });
  }

  async actualizarPorAuth0Id(auth0Id: string, data: any) {
    return this.prisma.usuario.update({
      where: { auth0Id },
      data,
    });
  }

  async buscarPorId(id: string) {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  async actualizarPorId(id: string, data: any) {
    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  // 🔥 SOFT DELETE
  async eliminarPorId(id: string) {
    return this.prisma.usuario.update({
      where: { id },
      data: { activo: false },
    });
  }

  async crearInstitucion(data: { nombre: string }) {
    return this.prisma.institucion.create({
      data,
    });
  }
}
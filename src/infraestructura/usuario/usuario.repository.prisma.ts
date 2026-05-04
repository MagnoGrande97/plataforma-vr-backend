import { UsuarioRepository } from '../../aplicacion/usuario/usuario.repository';
import { PrismaService } from '../database/prisma.service';

export class UsuarioRepositoryPrisma implements UsuarioRepository {
  constructor(private prisma: PrismaService) {}

  // =========================
  // 🔹 BUSCAR
  // =========================

  async buscarPorAuth0Id(auth0Id: string) {
    return this.prisma.usuario.findUnique({
      where: { auth0Id },
    });
  }

  async buscarPorId(id: string) {
    return this.prisma.usuario.findUnique({
      where: { id },
    });
  }

  async buscarPorEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  // =========================
  // 🔹 CREAR
  // =========================

  async crear(data: {
    auth0Id: string;
    email: string;
    nombre: string;
    institucionId?: string;
  }) {
    return this.prisma.usuario.create({
      data: {
        ...data,
        rol: 'user',
        activo: true,
      },
    });
  }

  async crearPorAdmin(data: {
    email: string;
    nombre: string;
    institucionId: string;
  }) {
    return this.prisma.usuario.create({
      data: {
        auth0Id: 'pendiente',
        email: data.email,
        nombre: data.nombre,
        institucionId: data.institucionId,
        rol: 'user',
        activo: true,
      },
    });
  }

  // 🔥 ESTE ES EL QUE FALTABA
  async crearInstitucion(data: { nombre: string }) {
    return this.prisma.institucion.create({
      data,
    });
  }

  // =========================
  // 🔹 ACTUALIZAR
  // =========================

  async actualizarPorAuth0Id(auth0Id: string, data: any) {
    return this.prisma.usuario.update({
      where: { auth0Id },
      data,
    });
  }

  async actualizarPorId(id: string, data: any) {
    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  // =========================
  // 🔥 DELETE (SOFT)
  // =========================

  async eliminarPorId(id: string) {
    return this.prisma.usuario.update({
      where: { id },
      data: { activo: false },
    });
  }
}
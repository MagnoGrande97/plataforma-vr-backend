export class Usuario {
  id: string;
  auth0Id: string;
  email: string;
  nombre: string;
  institucionId?: string;
  rol?: string;
  creadoEn: Date;
}
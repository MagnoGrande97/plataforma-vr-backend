import { IsEmail, IsString } from 'class-validator';

export class InvitarUsuarioDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString({ message: 'Nombre requerido' })
  nombre: string;
}
import { IsOptional, IsString, IsIn } from 'class-validator';

export class ActualizarUsuarioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  institucionId?: string;

  @IsOptional()
  @IsIn(['admin', 'user'])
  rol?: string;
}
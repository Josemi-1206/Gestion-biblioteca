import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsString()
  tipo: string;

  @IsInt()
  @IsOptional()
  limitePrestamos?: number;
}
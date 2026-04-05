import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateReservaDto {
  @IsInt()
  usuarioId: number;

  @IsInt()
  libroId: number;

  @IsString()
  @IsOptional()
  estado?: string;
}

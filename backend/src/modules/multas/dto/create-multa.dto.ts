import { IsInt, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateMultaDto {
  @IsInt()
  prestamoId: number;

  @IsNumber()
  valor: number;

  @IsInt()
  diasRetraso: number;

  @IsString()
  @IsOptional()
  estado?: string;
}

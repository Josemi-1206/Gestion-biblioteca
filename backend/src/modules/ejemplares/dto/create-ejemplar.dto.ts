import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateEjemplarDto {
  @IsInt()
  libroId: number;

  @IsString()
  @IsOptional()
  estado?: string;
}
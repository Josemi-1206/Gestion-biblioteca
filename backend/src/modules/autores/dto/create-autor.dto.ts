import { IsString, IsOptional } from 'class-validator';

export class CreateAutorDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  biografia?: string;

  @IsString()
  @IsOptional()
  nacionalidad?: string;
}
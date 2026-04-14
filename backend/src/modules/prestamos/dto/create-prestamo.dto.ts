import { IsInt, IsDateString } from 'class-validator';

export class CreatePrestamoDto {
  @IsInt()
  usuarioId: number;

  @IsInt()
  ejemplarId: number;

  @IsDateString()
  fechaDevolucionEsperada: string;
}

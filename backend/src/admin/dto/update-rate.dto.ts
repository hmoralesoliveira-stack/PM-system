import { IsNumber, Min } from 'class-validator';

export class UpdateRateDto {
  @IsNumber()
  @Min(0)
  hourlyRate: number;
}

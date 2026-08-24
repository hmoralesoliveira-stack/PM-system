import { IsEmail, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class InviteMemberDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;
}

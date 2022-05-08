import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator"

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  lastName: String

  @ApiProperty()
  @IsOptional()
  firstName?: String

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: String

  @ApiProperty()
  @IsOptional()
  phone?: String

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: String

  @ApiProperty()
  @IsOptional()
  address?: String

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  birthDate?: Date

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActif?: boolean
}

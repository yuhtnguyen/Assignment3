import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateStudentDto {
  @ApiProperty({ description: 'Student full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Student code' })
  @IsString()
  @IsNotEmpty()
  studentCode: string;

  @ApiProperty({ description: 'Student status' })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}

export class UpdateStudentDto {
  @ApiPropertyOptional({ description: 'Student full name' })
  name?: string;

  @ApiPropertyOptional({ description: 'Student status' })
  isActive?: boolean;
}
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '16404247' })
  phone_number: string;

  @ApiProperty({ example: '123' })
  password: string;
}

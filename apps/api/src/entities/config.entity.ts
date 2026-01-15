import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ConfigEntity {
  @ApiProperty({
    description: 'Unique configuration key identifier',
    example: 'APP_NAME',
    required: true,
  })
  @PrimaryColumn({
    type: 'text',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: 'Configuration value associated with the key',
    example: 'NestJS Template',
    required: true,
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  value: string;
}

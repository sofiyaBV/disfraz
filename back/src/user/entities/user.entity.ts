import { IsNotEmpty, MinLength, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../auth/enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string; // Email для авторизації (замість username, оскільки ТЗ вказує email/google/phone)


  @Column({ type: 'varchar', length: 255 })
  @MinLength(6)
  password: string; // Пароль для login+password

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsPhoneNumber('UA') // Номер телефону для авторизації (Україна за замовчуванням)
  phone: string; // Номер телефону (додано за вашим запитом)


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: Role,
    array: true, // Храним массив ролей
    default: [Role.User], // По умолчанию обычный пользователь
  })
  roles: Role[];
}


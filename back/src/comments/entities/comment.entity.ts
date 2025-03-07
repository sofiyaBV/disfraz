import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number; // Унікальний ідентифікатор коментаря

  @Column({ type: 'text' })
  content: string; // Текст коментаря

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Дата створення коментаря

  @Column({ type: 'boolean', default: false })
  isModerated: boolean; // Чи пройшов коментар модерацію
}

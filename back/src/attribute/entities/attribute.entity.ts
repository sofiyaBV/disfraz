import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number; // Унікальний ідентифікатор атрибута

  @Column({ type: 'varchar', length: 255 })
  name: string; // Назва атрибута (наприклад, «шкіра», «M», «фентезі», «руки»)

  @Column({ type: 'boolean', default: false })
  isMaterial: boolean; // Чи є атрибут матеріалом (наприклад, «Шкіра»)

  @Column({ type: 'boolean', default: false })
  isSize: boolean; // Чи є атрибут розміром (наприклад, «M»)

  @Column({ type: 'boolean', default: false })
  isTheme: boolean; // Чи є атрибут тематикою (наприклад, «Фентезі»)

  @Column({ type: 'boolean', default: false })
  isBodyPart: boolean; // Чи є атрибут частиною тіла (наприклад, «Руки»)

  @Column({ type: 'boolean', default: false })
  isSet: boolean; // Чи є атрибут вказівкою на комплект (наприклад, true/false)

  @Column({ type: 'boolean', default: false })
  isAdditionalInfo: boolean; // Чи є атрибут додатковою інформацією

  @Column({ type: 'boolean', default: false })
  isInStock: boolean; // Чи є атрибут інформацією про наявність

  @Column({ type: 'boolean', default: false, nullable: true })
  valueBoolean?: boolean; // Для булевих значень (наприклад, isSet, isInStock)

  @Column({ type: 'text', nullable: true })
  valueText?: string; // Для текстових значень (наприклад, матеріали, розміри, тематика, додаткова інформація)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valueNumber?: number; // Для числових значень, якщо потрібно (наприклад, ціна чи розмір у числовому форматі)
}
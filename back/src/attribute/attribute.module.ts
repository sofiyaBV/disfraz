import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';
import { AttributesService } from './attribute.service';
import { AttributesController } from './attribute.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute])],
   controllers: [AttributesController], 
  providers: [AttributesService],
  exports: [AttributesService], // Експортуємо сервіс для використання в інших модулях
})
export class AttributesModule {}
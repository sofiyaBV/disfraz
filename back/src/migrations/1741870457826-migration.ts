import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1741870457826 implements MigrationInterface {
  name = 'Migration1741870457826';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "attribute" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "material" character varying(255),
        "size" character varying(255),
        "theme" character varying(255),
        "bodyPart" character varying(255),
        "isSet" boolean NOT NULL DEFAULT false,
        "additionalInfo" character varying(255),
        "inStock" character varying(255),
        "valueText" text,
        "valueNumber" numeric(10,2),
        CONSTRAINT "PK_b13fb7c5c9e9dff62b60e0de729" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "product" (
        "id" SERIAL NOT NULL,
        "name" character varying(255) NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "description" text,
        "images" jsonb, -- Изменено с text array на jsonb
        "similarproducts" integer array,
        CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "comment" (
        "id" SERIAL NOT NULL,
        "content" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "isModerated" boolean NOT NULL DEFAULT false,
        "productAttributeId" integer,
        "userId" integer,
        CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id")
      )`,
    );

    // Создаем перечисляемый тип для deliveryMethod **до** создания таблицы order
    await queryRunner.query(`
      CREATE TYPE "public"."order_deliverymethod_enum" AS ENUM(
        'Самовивіз',
        'Нова Пошта - відділення',
        'Нова Пошта - кур’єр',
        'УкрПошта - відділення'
      );
    `);

    await queryRunner.query(
      `CREATE TABLE "order" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "customerName" character varying(255) NOT NULL,
        "customerEmail" character varying(255) NOT NULL,
        "customerPhone" character varying(20) NOT NULL,
        "deliveryAddress" text NOT NULL,
        "deliveryMethod" "public"."order_deliverymethod_enum" NOT NULL DEFAULT 'Самовивіз',
        "notes" text,
        "status" character varying(50) NOT NULL DEFAULT 'Pending',
        "cartId" integer,
        "userId" integer,
        CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "user" (
        "id" SERIAL NOT NULL,
        "email" character varying(255) NOT NULL,
        "password" character varying(255) NOT NULL,
        "phone" character varying(255),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "roles" character varying array NOT NULL DEFAULT '{user}',
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "cart" (
        "id" SERIAL NOT NULL,
        "quantity" integer NOT NULL DEFAULT '1',
        "price" numeric(10,2) NOT NULL DEFAULT '0',
        "addedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "productAttributeId" integer,
        "userId" integer,
        CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "product_attribute" (
        "id" SERIAL NOT NULL,
        "productId" integer,
        "attributeId" integer,
        CONSTRAINT "PK_f9b91f38df3dbbe481d9e056e5e" PRIMARY KEY ("id"),
        CONSTRAINT "FK_productId" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_attributeId" FOREIGN KEY ("attributeId") REFERENCES "attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_c0d597555330c0a972122bf467" ON "product_attribute" ("productId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5134aa627db96cdfb1bf0be522" ON "product_attribute" ("attributeId")`,
    );

    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_3703ece10c1b39c69497e30fe3e" FOREIGN KEY ("productAttributeId") REFERENCES "product_attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_fe3963d525b2ee03ba471953a7c" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_c892e111d38370431e1808125c0" FOREIGN KEY ("productAttributeId") REFERENCES "product_attribute"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // Создание функции update_cart_price
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_cart_price()
      RETURNS TRIGGER AS $$
      BEGIN
          -- Получаем базовую цену из product через product_attribute
          SELECT p.price INTO NEW.price
          FROM public.product p
          JOIN public.product_attribute pa ON p.id = pa."productId"
          WHERE pa.id = NEW."productAttributeId";

          -- Если цена не найдена, устанавливаем price = 0
          IF NEW.price IS NULL THEN
              NEW.price = 0.0;
          END IF;

          -- Умножаем базовую цену на quantity
          NEW.price = NEW.price * NEW.quantity;

          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Создание триггера trigger_update_cart_price
    await queryRunner.query(`
      CREATE TRIGGER trigger_update_cart_price
      BEFORE INSERT OR UPDATE OF quantity ON public.cart
      FOR EACH ROW
      EXECUTE FUNCTION update_cart_price();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаление триггера
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS trigger_update_cart_price ON public.cart;
    `);

    // Удаление функции
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS update_cart_price;
    `);

    // Удаление внешних ключей
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_c892e111d38370431e1808125c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_fe3963d525b2ee03ba471953a7c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_3703ece10c1b39c69497e30fe3e"`,
    );

    // Удаление индексов
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c0d597555330c0a972122bf467"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5134aa627db96cdfb1bf0be522"`,
    );

    // Удаление таблиц
    await queryRunner.query(`DROP TABLE "product_attribute"`);
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "order"`);

    // Удаление перечисляемого типа **после** удаления таблицы order
    await queryRunner.query(`
      DROP TYPE IF EXISTS "public"."order_deliverymethod_enum";
    `);

    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "attribute"`);
  }
}
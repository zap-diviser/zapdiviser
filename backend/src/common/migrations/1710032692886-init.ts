import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1710032692886 implements MigrationInterface {
  name = 'Init1710032692886';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "redirectLink" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "link" character varying NOT NULL, "redirectId" uuid, CONSTRAINT "PK_cc5d19bcafbfb05680584aba66e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "redirect" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "slug" character varying NOT NULL, "userId" uuid, CONSTRAINT "UQ_4f5d2b95893b20e5329594720b8" UNIQUE ("slug"), CONSTRAINT "PK_36fa169d0f5d2761cdc3ab33b5e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "flow-event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_flow_id" uuid NOT NULL, "type" character varying NOT NULL, "sort" integer NOT NULL, "metadata" jsonb, "times_sent" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_7a6647045e49403d89a411b944a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product-flow" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" uuid NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_dbd3db5a777d8dfd65ad2b3e74c" UNIQUE ("product_id", "name"), CONSTRAINT "PK_c182177994f914c8ae1ed3a415e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events-history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "instanceId" character varying NOT NULL, "to" character varying NOT NULL, "product_id" uuid NOT NULL, CONSTRAINT "PK_c9f982998a83d0e449ec6b3ab6e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."whatsapp_status_enum" AS ENUM('0', '1', '2', '3')`,
    );
    await queryRunner.query(
      `CREATE TABLE "whatsapp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "phone" character varying, "profileUrl" character varying, "status" "public"."whatsapp_status_enum" NOT NULL DEFAULT '2', "user_id" uuid NOT NULL, CONSTRAINT "PK_17f5e142323073a3c507bbe207c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "phone" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "level" character varying NOT NULL DEFAULT 'user', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_whatsapps_whatsapp" ("productId" uuid NOT NULL, "whatsappId" uuid NOT NULL, CONSTRAINT "PK_a3310cd638493fc08d8c19e507f" PRIMARY KEY ("productId", "whatsappId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4ecd41414ebf267d4db810fc30" ON "product_whatsapps_whatsapp" ("productId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b8351fec02c9ca37e61d5bbeb9" ON "product_whatsapps_whatsapp" ("whatsappId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "redirectLink" ADD CONSTRAINT "FK_3965b8f98e2eddd227c83e0aa86" FOREIGN KEY ("redirectId") REFERENCES "redirect"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "redirect" ADD CONSTRAINT "FK_c17937de5f4fabb9ca7d241c5c7" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "flow-event" ADD CONSTRAINT "FK_57e89aad8b0c04f6d26f77c3ec6" FOREIGN KEY ("product_flow_id") REFERENCES "product-flow"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product-flow" ADD CONSTRAINT "FK_9b32eb93b846ce833b4d0c3559f" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events-history" ADD CONSTRAINT "FK_975fc49b7e7e7f50554676b3891" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_3e59a34134d840e83c2010fac9a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "whatsapp" ADD CONSTRAINT "FK_167fc9dcb3bcb66d7852587a096" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_whatsapps_whatsapp" ADD CONSTRAINT "FK_4ecd41414ebf267d4db810fc30c" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_whatsapps_whatsapp" ADD CONSTRAINT "FK_b8351fec02c9ca37e61d5bbeb92" FOREIGN KEY ("whatsappId") REFERENCES "whatsapp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_whatsapps_whatsapp" DROP CONSTRAINT "FK_b8351fec02c9ca37e61d5bbeb92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_whatsapps_whatsapp" DROP CONSTRAINT "FK_4ecd41414ebf267d4db810fc30c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "whatsapp" DROP CONSTRAINT "FK_167fc9dcb3bcb66d7852587a096"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_3e59a34134d840e83c2010fac9a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events-history" DROP CONSTRAINT "FK_975fc49b7e7e7f50554676b3891"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product-flow" DROP CONSTRAINT "FK_9b32eb93b846ce833b4d0c3559f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "flow-event" DROP CONSTRAINT "FK_57e89aad8b0c04f6d26f77c3ec6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "redirect" DROP CONSTRAINT "FK_c17937de5f4fabb9ca7d241c5c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "redirectLink" DROP CONSTRAINT "FK_3965b8f98e2eddd227c83e0aa86"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b8351fec02c9ca37e61d5bbeb9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4ecd41414ebf267d4db810fc30"`,
    );
    await queryRunner.query(`DROP TABLE "product_whatsapps_whatsapp"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "whatsapp"`);
    await queryRunner.query(`DROP TYPE "public"."whatsapp_status_enum"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "events-history"`);
    await queryRunner.query(`DROP TABLE "product-flow"`);
    await queryRunner.query(`DROP TABLE "flow-event"`);
    await queryRunner.query(`DROP TABLE "redirect"`);
    await queryRunner.query(`DROP TABLE "redirectLink"`);
  }
}

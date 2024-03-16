import { MigrationInterface, QueryRunner } from 'typeorm';

export class Status1710551053349 implements MigrationInterface {
  name = 'Status1710551053349';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."whatsapp_status_enum" RENAME TO "whatsapp_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."whatsapp_status_enum" AS ENUM('0', '1', '2', '3', '4')`,
    );
    await queryRunner.query(
      `ALTER TABLE "whatsapp" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "whatsapp" ALTER COLUMN "status" TYPE "public"."whatsapp_status_enum" USING "status"::"text"::"public"."whatsapp_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "whatsapp" ALTER COLUMN "status" SET DEFAULT '0'`,
    );
    await queryRunner.query(`DROP TYPE "public"."whatsapp_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."whatsapp_status_enum_old" AS ENUM('0', '1', '2', '3')`,
    );
    await queryRunner.query(
      `ALTER TABLE "whatsapp" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "whatsapp" ALTER COLUMN "status" TYPE "public"."whatsapp_status_enum_old" USING "status"::"text"::"public"."whatsapp_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "whatsapp" ALTER COLUMN "status" SET DEFAULT '2'`,
    );
    await queryRunner.query(`DROP TYPE "public"."whatsapp_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."whatsapp_status_enum_old" RENAME TO "whatsapp_status_enum"`,
    );
  }
}

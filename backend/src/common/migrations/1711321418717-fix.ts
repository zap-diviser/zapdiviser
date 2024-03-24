import { MigrationInterface, QueryRunner } from 'typeorm';

export class Fix1711321418717 implements MigrationInterface {
  name = 'Fix1711321418717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "whatsapp" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."whatsapp_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "whatsapp" ADD "status" character varying NOT NULL DEFAULT 'PENDING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "whatsapp" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."whatsapp_status_enum" AS ENUM('0', '1', '2', '3', '4')`,
    );
    await queryRunner.query(
      `ALTER TABLE "whatsapp" ADD "status" "public"."whatsapp_status_enum" NOT NULL DEFAULT '0'`,
    );
  }
}

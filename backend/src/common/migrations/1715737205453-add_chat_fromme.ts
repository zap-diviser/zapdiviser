import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChatFromme1715737205453 implements MigrationInterface {
  name = 'AddChatFromme1715737205453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Message" ADD "fromMe" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Message" DROP COLUMN "fromMe"`);
  }
}

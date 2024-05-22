import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChatDate1716351300671 implements MigrationInterface {
  name = 'AddChatDate1716351300671';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Chat" ADD "lastInteraction" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Chat" DROP COLUMN "lastInteraction"`);
  }
}

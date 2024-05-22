import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChatName1715707885482 implements MigrationInterface {
  name = 'AddChatName1715707885482';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Chat" ADD "name" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Chat" DROP COLUMN "name"`);
  }
}

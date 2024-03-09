import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultToUser1709063176468 implements MigrationInterface {
  name = 'AddDefaultToUser1709063176468';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "level" SET DEFAULT 'user'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "level" DROP DEFAULT`,
    );
  }
}

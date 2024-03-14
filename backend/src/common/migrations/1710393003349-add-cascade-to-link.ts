import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCascadeToLink1710393003349 implements MigrationInterface {
  name = 'AddCascadeToLink1710393003349';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "redirectLink" DROP CONSTRAINT "FK_3965b8f98e2eddd227c83e0aa86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "redirectLink" ADD CONSTRAINT "FK_3965b8f98e2eddd227c83e0aa86" FOREIGN KEY ("redirectId") REFERENCES "redirect"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "redirectLink" DROP CONSTRAINT "FK_3965b8f98e2eddd227c83e0aa86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "redirectLink" ADD CONSTRAINT "FK_3965b8f98e2eddd227c83e0aa86" FOREIGN KEY ("redirectId") REFERENCES "redirect"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

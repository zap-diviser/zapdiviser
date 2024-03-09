import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCascadeEventsFlow1708800651655 implements MigrationInterface {
  name = 'AddCascadeEventsFlow1708800651655';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "flow-event" DROP CONSTRAINT "FK_57e89aad8b0c04f6d26f77c3ec6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product-flow" DROP CONSTRAINT "FK_9b32eb93b846ce833b4d0c3559f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events-history" DROP CONSTRAINT "FK_975fc49b7e7e7f50554676b3891"`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE "events-history" ADD CONSTRAINT "FK_975fc49b7e7e7f50554676b3891" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product-flow" ADD CONSTRAINT "FK_9b32eb93b846ce833b4d0c3559f" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "flow-event" ADD CONSTRAINT "FK_57e89aad8b0c04f6d26f77c3ec6" FOREIGN KEY ("product_flow_id") REFERENCES "product-flow"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

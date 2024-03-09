import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUniqueFromFlowEvent1708525098402
  implements MigrationInterface
{
  name = 'RemoveUniqueFromFlowEvent1708525098402';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "flow-event" DROP CONSTRAINT "UQ_138d995478ca77850f12bf193f6"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "flow-event" ADD CONSTRAINT "UQ_138d995478ca77850f12bf193f6" UNIQUE ("product_flow_id", "sort")`,
    );
  }
}

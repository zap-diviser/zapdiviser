import { MigrationInterface, QueryRunner } from "typeorm";

export class Fix1710429328411 implements MigrationInterface {
    name = 'Fix1710429328411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "logs" DROP CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba"`);
        await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "logs" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "logs" ADD CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logs" DROP CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba"`);
        await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "logs" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "logs" ADD CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "logs" ADD "deleted_at" TIMESTAMP`);
    }

}

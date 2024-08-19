import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChatFromme1724076261565 implements MigrationInterface {
    name = 'AddChatFromme1724076261565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "status" character varying NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "instancesLimit" integer NOT NULL DEFAULT '10'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "instancesLimit"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
    }

}

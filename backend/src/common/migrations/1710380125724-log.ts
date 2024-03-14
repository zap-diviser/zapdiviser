import { MigrationInterface, QueryRunner } from 'typeorm';

export class Log1710380125724 implements MigrationInterface {
  name = 'Log1710380125724';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(),  "record_id" integer NOT NULL, "record_title" text DEFAULT '', "difference" jsonb DEFAULT '{}', "action" character varying(128) NOT NULL, "resource" character varying(128) NOT NULL, "user_id" character varying NOT NULL, CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "logs"`);
  }
}

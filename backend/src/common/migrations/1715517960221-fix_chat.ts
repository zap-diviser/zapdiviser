import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixChat1715517960221 implements MigrationInterface {
  name = 'FixChat1715517960221';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "content" jsonb NOT NULL, "chatId" uuid, CONSTRAINT "PK_7dd6398f0d1dcaf73df342fa325" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Chat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "phone" character varying, "userId" uuid, "currentWhatsappId" uuid, "messagesId" uuid, CONSTRAINT "PK_d9fa791e91c30baf21d778d3f2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Message" ADD CONSTRAINT "FK_c5370d7d3bc8ee603a401aee50e" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Chat" ADD CONSTRAINT "FK_46c776ff5ddf1d4874dfb91e7bb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Chat" ADD CONSTRAINT "FK_6a6f169ff1d06c0b89c6f1eb879" FOREIGN KEY ("currentWhatsappId") REFERENCES "whatsapp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Chat" ADD CONSTRAINT "FK_17b550af94bd9aaa8c00431ec9e" FOREIGN KEY ("messagesId") REFERENCES "Message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Chat" DROP CONSTRAINT "FK_17b550af94bd9aaa8c00431ec9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Chat" DROP CONSTRAINT "FK_6a6f169ff1d06c0b89c6f1eb879"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Chat" DROP CONSTRAINT "FK_46c776ff5ddf1d4874dfb91e7bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Message" DROP CONSTRAINT "FK_c5370d7d3bc8ee603a401aee50e"`,
    );
    await queryRunner.query(`DROP TABLE "Chat"`);
    await queryRunner.query(`DROP TABLE "Message"`);
  }
}

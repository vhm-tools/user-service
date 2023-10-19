import { MigrationInterface, QueryRunner } from 'typeorm';

export class EntityTemplate1697189550093 implements MigrationInterface {
  name = 'EntityTemplate1697189550093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" character varying, "user_id" character varying NOT NULL, "metadata" jsonb, CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "templates"`);
  }
}

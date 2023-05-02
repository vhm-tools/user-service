import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitUserAuth1681961500415 implements MigrationInterface {
  name = 'InitUserAuth1681961500415';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'BLOCK')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('SUPERVISOR', 'ADMIN', 'USER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "first_name" character varying NOT NULL DEFAULT '', "last_name" character varying NOT NULL DEFAULT '', "status" "public"."users_status_enum" NOT NULL DEFAULT 'INACTIVE', "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "avatar" character varying, "last_login" TIMESTAMP WITH TIME ZONE, "user_agent" jsonb, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "oauth_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" character varying NOT NULL, "access_token" character varying, "user_id" uuid NOT NULL, "metadata" jsonb, CONSTRAINT "PK_a3fbd747f8d52eca3c60c0cb40c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "oauth_profiles" ADD CONSTRAINT "FK_1148062cbd46eb8f74c5f301cf0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "oauth_profiles" DROP CONSTRAINT "FK_1148062cbd46eb8f74c5f301cf0"`,
    );
    await queryRunner.query(`DROP TABLE "oauth_profiles"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
  }
}

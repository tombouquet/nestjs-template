import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1768632578033 implements MigrationInterface {
    name = 'Migration1768632578033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "password" character varying NOT NULL, "roles" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_415c35b9b3b6fe45a3b065030f" ON "user_entity" ("email") `);
        await queryRunner.query(`CREATE TABLE "file_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "original_name" character varying NOT NULL, "mime_type" character varying NOT NULL, "size" bigint NOT NULL, "storage_key" character varying NOT NULL, "bucket" character varying NOT NULL, CONSTRAINT "UQ_642c05845338e8a90d084a96395" UNIQUE ("storage_key"), CONSTRAINT "PK_d8375e0b2592310864d2b4974b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_642c05845338e8a90d084a9639" ON "file_entity" ("storage_key") `);
        await queryRunner.query(`CREATE TABLE "access_token_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "token" character varying NOT NULL, "roles" jsonb NOT NULL DEFAULT '[]', "name" character varying NOT NULL, "description" character varying, "active" boolean NOT NULL DEFAULT true, "expires_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_59c985b48c1c1b81c757fd72177" UNIQUE ("token"), CONSTRAINT "PK_ff869158ed0606fbadea03f6fd7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_59c985b48c1c1b81c757fd7217" ON "access_token_entity" ("token") `);
        await queryRunner.query(`CREATE TABLE "config_entity" ("key" text NOT NULL, "value" character varying NOT NULL, CONSTRAINT "PK_343ec12d098643a80c3a17b0541" PRIMARY KEY ("key"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "config_entity"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_59c985b48c1c1b81c757fd7217"`);
        await queryRunner.query(`DROP TABLE "access_token_entity"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_642c05845338e8a90d084a9639"`);
        await queryRunner.query(`DROP TABLE "file_entity"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_415c35b9b3b6fe45a3b065030f"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
    }

}

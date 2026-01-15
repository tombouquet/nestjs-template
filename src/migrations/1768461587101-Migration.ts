import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1768461587101 implements MigrationInterface {
    name = 'Migration1768461587101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "access_token_entity" ("token" uuid NOT NULL DEFAULT uuid_generate_v4(), "roles" jsonb NOT NULL DEFAULT '[]', "name" character varying NOT NULL, "description" character varying, "active" boolean NOT NULL DEFAULT true, "expires_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_59c985b48c1c1b81c757fd72177" PRIMARY KEY ("token"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_59c985b48c1c1b81c757fd7217" ON "access_token_entity" ("token") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_59c985b48c1c1b81c757fd7217"`);
        await queryRunner.query(`DROP TABLE "access_token_entity"`);
    }

}

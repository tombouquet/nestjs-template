import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1767698780228 implements MigrationInterface {
    name = 'Migration1767698780228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "config_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "key" text NOT NULL, "value" character varying NOT NULL, CONSTRAINT "PK_fefdc27328a38183804f4abcceb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_343ec12d098643a80c3a17b054" ON "config_entity" ("key") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_343ec12d098643a80c3a17b054"`);
        await queryRunner.query(`DROP TABLE "config_entity"`);
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class fixAttributeError1624370751612 implements MigrationInterface {
    name = 'fixAttributeError1624370751612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "lastname" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" ALTER COLUMN "lastname" SET NOT NULL`);
    }

}

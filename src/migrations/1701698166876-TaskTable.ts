// import { table } from "console";
// import { MigrationInterface, QueryRunner } from "typeorm"

// export class TaskTable1701698166876 implements MigrationInterface {

//     public async up(queryRunner: QueryRunner): Promise<void> {

//         await queryRunner.createTable(new table({
//             name: "task",
//             columns: [
//                 {
//                     name: "id",
//                     type: "uuid", // Use "uuid" type for UUID
//                     generationStrategy: "uuid", // Generate UUIDs automatically
//                     default: 'uuid_generate_v4()',
//                     isPrimary: true
//                 },
//                 {
//                     name: "name",
//                     type: "varchar",
//                     isNullable: false
//                 }
//             ]
//         }), true)
        
//         // await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
//         await queryRunner.query(`INSERT INTO "task" ("title") VALUES ('Task 1')`);
//         await queryRunner.query(`INSERT INTO "task" ("title") VALUES ('Task 2')`);
//         await queryRunner.query(`INSERT INTO "task" ("title") VALUES ('Task 3')`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.dropTable("task")
//     }

// }

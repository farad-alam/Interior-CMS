import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "cloudinary_u_r_l" varchar;
  ALTER TABLE "media" ADD COLUMN "cloudinary_public_id" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP COLUMN "cloudinary_u_r_l";
  ALTER TABLE "media" DROP COLUMN "cloudinary_public_id";`)
}

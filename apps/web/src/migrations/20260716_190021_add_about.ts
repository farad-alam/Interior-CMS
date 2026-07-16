import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "about_image_id" integer;
  ALTER TABLE "site_settings_locales" ADD COLUMN "about_heading" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "about_body" varchar;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_about_image_id_media_id_fk" FOREIGN KEY ("about_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_about_about_image_idx" ON "site_settings" USING btree ("about_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_about_image_id_media_id_fk";
  
  DROP INDEX "site_settings_about_about_image_idx";
  ALTER TABLE "site_settings" DROP COLUMN "about_image_id";
  ALTER TABLE "site_settings_locales" DROP COLUMN "about_heading";
  ALTER TABLE "site_settings_locales" DROP COLUMN "about_body";`)
}

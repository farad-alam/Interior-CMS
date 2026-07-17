import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "hero_variant";
  DROP TYPE "public"."enum_site_settings_hero_variant";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_hero_variant" AS ENUM('hero01', 'hero02');
  ALTER TABLE "site_settings" ADD COLUMN "hero_variant" "enum_site_settings_hero_variant" DEFAULT 'hero01' NOT NULL;`)
}

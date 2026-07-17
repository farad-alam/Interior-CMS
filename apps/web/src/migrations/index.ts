import * as migration_20260716_064941_initial from './20260716_064941_initial';
import * as migration_20260716_190021_add_about from './20260716_190021_add_about';
import * as migration_20260716_192151_add_cloudinary_fields from './20260716_192151_add_cloudinary_fields';
import * as migration_20260717_155941_add_hero_variant from './20260717_155941_add_hero_variant';
import * as migration_20260717_162517_remove_site_hero_variant from './20260717_162517_remove_site_hero_variant';
import * as migration_20260717_162613_add_homepage_builder from './20260717_162613_add_homepage_builder';

export const migrations = [
  {
    up: migration_20260716_064941_initial.up,
    down: migration_20260716_064941_initial.down,
    name: '20260716_064941_initial',
  },
  {
    up: migration_20260716_190021_add_about.up,
    down: migration_20260716_190021_add_about.down,
    name: '20260716_190021_add_about',
  },
  {
    up: migration_20260716_192151_add_cloudinary_fields.up,
    down: migration_20260716_192151_add_cloudinary_fields.down,
    name: '20260716_192151_add_cloudinary_fields',
  },
  {
    up: migration_20260717_155941_add_hero_variant.up,
    down: migration_20260717_155941_add_hero_variant.down,
    name: '20260717_155941_add_hero_variant',
  },
  {
    up: migration_20260717_162517_remove_site_hero_variant.up,
    down: migration_20260717_162517_remove_site_hero_variant.down,
    name: '20260717_162517_remove_site_hero_variant',
  },
  {
    up: migration_20260717_162613_add_homepage_builder.up,
    down: migration_20260717_162613_add_homepage_builder.down,
    name: '20260717_162613_add_homepage_builder'
  },
];

import * as migration_20260716_064941_initial from './20260716_064941_initial';
import * as migration_20260716_190021_add_about from './20260716_190021_add_about';

export const migrations = [
  {
    up: migration_20260716_064941_initial.up,
    down: migration_20260716_064941_initial.down,
    name: '20260716_064941_initial',
  },
  {
    up: migration_20260716_190021_add_about.up,
    down: migration_20260716_190021_add_about.down,
    name: '20260716_190021_add_about'
  },
];

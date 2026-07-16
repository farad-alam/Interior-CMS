import * as migration_20260716_064941_initial from './20260716_064941_initial';

export const migrations = [
  {
    up: migration_20260716_064941_initial.up,
    down: migration_20260716_064941_initial.down,
    name: '20260716_064941_initial'
  },
];

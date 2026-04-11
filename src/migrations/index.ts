import * as migration_20260409_121530 from './20260409_121530';
import * as migration_20260411_143801 from './20260411_143801';

export const migrations = [
  {
    up: migration_20260409_121530.up,
    down: migration_20260409_121530.down,
    name: '20260409_121530',
  },
  {
    up: migration_20260411_143801.up,
    down: migration_20260411_143801.down,
    name: '20260411_143801'
  },
];

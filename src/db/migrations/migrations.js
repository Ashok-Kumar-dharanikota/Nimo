// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_uneven_molten_man.sql';
import m0001 from './0001_yellow_iron_lad.sql';
import m0002 from './0002_add_media_and_title.sql';
import m0003 from './0003_lively_shockwave.sql';
import m0004 from './0004_blushing_sunset_bain.sql';
import m0005 from './0005_new_lyja.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005
    }
  }
  
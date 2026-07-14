import * as migration_20260713_140429_smn_baseline_20260713 from './20260713_140429_smn_baseline_20260713';
import * as migration_20260714_marketing_cms_fields from './20260714_marketing_cms_fields';

export const migrations = [
  {
    up: migration_20260713_140429_smn_baseline_20260713.up,
    down: migration_20260713_140429_smn_baseline_20260713.down,
    name: '20260713_140429_smn_baseline_20260713'
  },
  {
    up: migration_20260714_marketing_cms_fields.up,
    down: migration_20260714_marketing_cms_fields.down,
    name: '20260714_marketing_cms_fields'
  },
];

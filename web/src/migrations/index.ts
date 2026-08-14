import * as migration_20260713_140429_smn_baseline_20260713 from './20260713_140429_smn_baseline_20260713';
import * as migration_20260714_marketing_cms_fields from './20260714_marketing_cms_fields';
import * as migration_20260717_events_paystack from './20260717_events_paystack';
import * as migration_20260814_wave3_cohort_applications from './20260814_wave3_cohort_applications';
import * as migration_20260814_wave4_drop_learning_items from './20260814_wave4_drop_learning_items';

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
  {
    up: migration_20260717_events_paystack.up,
    down: migration_20260717_events_paystack.down,
    name: '20260717_events_paystack'
  },
  {
    up: migration_20260814_wave3_cohort_applications.up,
    down: migration_20260814_wave3_cohort_applications.down,
    name: '20260814_wave3_cohort_applications'
  },
  {
    up: migration_20260814_wave4_drop_learning_items.up,
    down: migration_20260814_wave4_drop_learning_items.down,
    name: '20260814_wave4_drop_learning_items'
  },
];

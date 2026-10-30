import * as migration_20260713_140429_smn_baseline_20260713 from './20260713_140429_smn_baseline_20260713';
import * as migration_20260714_marketing_cms_fields from './20260714_marketing_cms_fields';
import * as migration_20260717_events_paystack from './20260717_events_paystack';
import * as migration_20260814_wave3_cohort_applications from './20260814_wave3_cohort_applications';
import * as migration_20260814_wave4_drop_learning_items from './20260814_wave4_drop_learning_items';
import * as migration_20260814_lms_cohort_delivery from './20260814_lms_cohort_delivery';
import * as migration_20260814_course_domain_rebuild from './20260814_course_domain_rebuild';
import * as migration_20260825_locked_documents_missing_rels from './20260825_locked_documents_missing_rels';
import * as migration_20260825_lms_cohort_workspace from './20260825_lms_cohort_workspace';
import * as migration_20261029_payload_3_90_security_schema from './20261029_payload_3_90_security_schema';
import * as migration_20261030_lms_lessons_resource_fields from './20261030_lms_lessons_resource_fields';
import * as migration_20261030_site_settings_primary_cta_href from './20261030_site_settings_primary_cta_href';

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
  {
    up: migration_20260814_lms_cohort_delivery.up,
    down: migration_20260814_lms_cohort_delivery.down,
    name: '20260814_lms_cohort_delivery'
  },
  {
    up: migration_20260814_course_domain_rebuild.up,
    down: migration_20260814_course_domain_rebuild.down,
    name: '20260814_course_domain_rebuild'
  },
  {
    up: migration_20260825_locked_documents_missing_rels.up,
    down: migration_20260825_locked_documents_missing_rels.down,
    name: '20260825_locked_documents_missing_rels'
  },
  {
    up: migration_20260825_lms_cohort_workspace.up,
    down: migration_20260825_lms_cohort_workspace.down,
    name: '20260825_lms_cohort_workspace'
  },
  {
    up: migration_20261029_payload_3_90_security_schema.up,
    down: migration_20261029_payload_3_90_security_schema.down,
    name: '20261029_payload_3_90_security_schema'
  },
  {
    up: migration_20261030_lms_lessons_resource_fields.up,
    down: migration_20261030_lms_lessons_resource_fields.down,
    name: '20261030_lms_lessons_resource_fields'
  },
  {
    up: migration_20261030_site_settings_primary_cta_href.up,
    down: migration_20261030_site_settings_primary_cta_href.down,
    name: '20261030_site_settings_primary_cta_href'
  },
];

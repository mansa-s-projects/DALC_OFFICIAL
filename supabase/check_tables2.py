import json
with open('supabase/tmp_remote_tables_utf8.json','r',encoding='utf-8-sig') as f:
    names=[t['table_name'] for t in json.load(f)]
checks=[
  'venues','emirates','venue_categories','profiles','suppliers','requests','request_status_log','bookings','payments','quotes','leads','events','intents',
  'concierge_requests','business_services','business_bookings','business_consultations','experience_services','experience_bookings','experiences',
  'transport_services','transport_bookings','stays_properties','stays_availability','stays_bookings','relocation_profiles','relocation_cost_estimates',
  'user_workflows','user_workflow_steps','user_documents','notification_preferences','notifications','services','categories','subcategories',
  'explore_locations','explore_categories','lead_automations','lead_enrichment_jobs','lead_enrichment_data','lead_history','lead_tasks','lead_ownership_history',
  'admin_users','avatars','visa_applications'
]
for c in checks:
    print(f"{c}: {'YES' if c in names else 'NO'}")

import json
with open('supabase/tmp_remote_tables_utf8.json','r',encoding='utf-8-sig') as f:
    names=[t['table_name'] for t in json.load(f)]
checks=['visa_applications','avatars','venue_categories','business_services','payments','quotes','intents','requests','request_status_log','bookings','profiles','suppliers','concierge_requests','relocation_profiles','user_documents','activity_bookings','transport_bookings','stays_bookings']
for c in checks:
    print(f"{c}: {'YES' if c in names else 'NO'}")

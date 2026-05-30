import json
with open('supabase/tmp_remote_columns_utf8.json', 'r', encoding='utf-8-sig') as f:
    cols = json.load(f)
for c in cols:
    if c['table_name'] == 'bookings':
        print(f"{c['column_name']} | {c['data_type']} | nullable={c['is_nullable']} | default={c['column_default']}")

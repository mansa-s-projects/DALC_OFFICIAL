import json
from pathlib import Path
fks = json.loads(Path('supabase/tmp_remote_fkeys_utf8.json').read_text(encoding='utf-8-sig'))
for table in ['bookings','payments','quotes','requests','profiles','venues','transport_bookings','stays_bookings']:
    print('TABLE', table)
    found = [fk for fk in fks if fk['table_name'] == table]
    if not found:
        print('  NO FKs')
    else:
        for fk in found:
            print(' ', fk['constraint_name'], fk['column_name'], '->', fk['foreign_table'], fk['foreign_column'])

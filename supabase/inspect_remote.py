import json
import pathlib

base = pathlib.Path('supabase')
tables = {t['table_name']: t['table_type'] for t in json.loads(base.joinpath('tmp_remote_tables_utf8.json').read_text(encoding='utf-8-sig'))}
cols = json.loads(base.joinpath('tmp_remote_columns_utf8.json').read_text(encoding='utf-8-sig'))
by_table = {}
for c in cols:
    by_table.setdefault(c['table_name'], []).append(c)

rows = [(table_name, table_type, len(by_table.get(table_name, []))) for table_name, table_type in sorted(tables.items())]
print('Remote object counts:')
print('Tables:', sum(1 for _, t, _ in rows if t == 'BASE TABLE'))
print('Views:', sum(1 for _, t, _ in rows if t == 'VIEW'))
print('Total objects:', len(rows))
print('Sample objects:')
for name, t, count in rows[:20]:
    print(f'  {name} ({t}) columns={count}')
print('----')
print('Sample booking cols:')
for c in by_table.get('bookings', []):
    print(c['column_name'], c['data_type'], c['is_nullable'], c['column_default'])

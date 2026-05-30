import json
from pathlib import Path

base = Path('supabase')
tables = json.loads(base.joinpath('tmp_remote_tables_types_utf8.json').read_text(encoding='utf-8-sig'))
columns = json.loads(base.joinpath('tmp_remote_columns_types_utf8.json').read_text(encoding='utf-8-sig'))

object_types = {item['table_name']: item['table_type'] for item in tables}

cols_by_table = {}
for col in columns:
    cols_by_table.setdefault(col['table_name'], []).append(col)

simple_type_map = {
    'uuid': 'string',
    'text': 'string',
    'character varying': 'string',
    'character': 'string',
    'json': 'Json',
    'jsonb': 'Json',
    'integer': 'number',
    'smallint': 'number',
    'bigint': 'string',
    'numeric': 'string',
    'real': 'number',
    'double precision': 'number',
    'boolean': 'boolean',
    'timestamp with time zone': 'string',
    'timestamp without time zone': 'string',
    'date': 'string',
    'time without time zone': 'string',
    'inet': 'string',
    'bytea': 'string',
    'uuid[]': 'string[]',
}

udt_map = {
    '_text': 'string[]',
    '_varchar': 'string[]',
    '_uuid': 'string[]',
    '_int4': 'number[]',
    '_int8': 'string[]',
    '_float4': 'number[]',
    '_float8': 'number[]',
    '_numeric': 'string[]',
    '_jsonb': 'Json[]',
    '_json': 'Json[]',
}


def ts_type(col):
    if col['data_type'] == 'ARRAY':
        return udt_map.get(col['udt_name'], 'Json[]')
    return simple_type_map.get(col['data_type'], simple_type_map.get(col['udt_name'], 'Json'))


def column_line(col):
    ts = ts_type(col)
    if col['is_nullable'] == 'YES':
        ts = f'{ts} | null'
    return f"  {col['column_name']}: {ts};"


def insert_line(col):
    ts = ts_type(col)
    if col['is_nullable'] == 'YES':
        ts = f'{ts} | null'
    optional = '?:'
    if col['is_nullable'] == 'NO' and col['column_default'] is None:
        optional = ':'
    return f"  {col['column_name']}{optional} {ts};"


def update_line(col):
    ts = ts_type(col)
    if col['is_nullable'] == 'YES':
        ts = f'{ts} | null'
    return f"  {col['column_name']}?: {ts};"


def render_object(name, cols, is_view=False):
    sorted_cols = sorted(cols, key=lambda c: c['ordinal_position'] if 'ordinal_position' in c else 0)
    lines = [f'    {name}: {{', '      Row: {']
    lines += [column_line(c) for c in sorted_cols]
    lines.append('      }')
    if not is_view:
        lines.append('      Insert: {')
        lines += [insert_line(c) for c in sorted_cols]
        lines.append('      }')
        lines.append('      Update: {')
        lines += [update_line(c) for c in sorted_cols]
        lines.append('      }')
    lines.append('    };')
    return lines


all_tables = sorted(set(cols_by_table.keys()))

lines = [
    '// GENERATED FROM REMOTE PRODUCTION SUPABASE SCHEMA. DO NOT EDIT DIRECTLY.',
    '',
    'export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];',
    '',
    'export interface Database {',
    '  public: {',
    '    Tables: {',
]

for table_name in sorted(all_tables):
    is_view = object_types.get(table_name) == 'VIEW'
    lines += render_object(table_name, cols_by_table[table_name], is_view=is_view)

lines += [
    '    };',
    '    Views: {',
]
for table_name in sorted(all_tables):
    if object_types.get(table_name) == 'VIEW':
        lines += render_object(table_name, cols_by_table[table_name], is_view=True)

lines += [
    '    };',
    '    Functions: {};',
    '    Enums: {};',
    '  };',
    '}',
]

Path('database.types.ts').write_text('\n'.join(lines) + '\n', encoding='utf-8')
print('database.types.ts generated with', len(all_tables), 'objects')

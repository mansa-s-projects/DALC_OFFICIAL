import json
import re
from pathlib import Path

base = Path('supabase')
cols = json.loads(base.joinpath('tmp_remote_columns_types_utf8.json').read_text(encoding='utf-8-sig'))
tables = {c['table_name']: [] for c in cols}
for c in cols:
    tables[c['table_name']].append(c['column_name'])

files = list(Path('src').rglob('*.ts')) + list(Path('src').rglob('*.tsx'))
from_pattern = re.compile(r"\.from\(\s*['\"]([a-zA-Z0-9_]+)['\"]\s*\)")
select_pattern = re.compile(r"\.select\(\s*['\"]([^)]+?)['\"]\s*\)")
any_pattern = re.compile(r"\bany\b")
any_cast_pattern = re.compile(r"as\s+any")
manual_interfaces = []

cwd = Path.cwd().resolve()

def safe_relpath(path: Path):
    try:
        return path.relative_to(cwd)
    except ValueError:
        return path

report = []

for path in files:
    text = path.read_text(encoding='utf-8', errors='ignore')
    relpath = safe_relpath(path)
    lines = text.splitlines()
    for i, line in enumerate(lines):
        for m in from_pattern.finditer(line):
            table = m.group(1)
            if table not in tables:
                report.append((relpath, i+1, 'UNKNOWN_TABLE', table, line.strip()))
                continue
            sel = None
            # search same line and next 3 lines for select
            snippet = line
            for j in range(i, min(i+4, len(lines))):
                snippet += ' ' + lines[j]
            sel_match = select_pattern.search(snippet)
            if sel_match:
                sel = sel_match.group(1)
                # if contains alias calls, simplify
                cols_list = [c.strip() for c in re.split(r',\s*(?![^()]*\))', sel)]
                cols_expanded = []
                for col in cols_list:
                    if col.strip() == '*':
                        cols_expanded = ['*']
                        break
                    if ':' in col and col.endswith('(*)'):
                        cols_expanded.append('*')
                        continue
                    cols_expanded.append(col.strip().split(':')[-1].strip())
                unknown = []
                if cols_expanded and cols_expanded != ['*']:
                    for col in cols_expanded:
                        if col == '*' or col == 'count' or col.endswith(']'):
                            continue
                        if col not in tables[table] and col not in ('id',):
                            unknown.append(col)
                status = 'SAFE'
                if unknown:
                    status = 'BROKEN'
                report.append((relpath, i+1, status, table, sel, unknown))
            else:
                report.append((relpath, i+1, 'NO_SELECT', table, line.strip()))

# any usage
any_uses = []
for path in files:
    text = path.read_text(encoding='utf-8', errors='ignore')
    relpath = safe_relpath(path)
    for i, line in enumerate(text.splitlines(), start=1):
        if any_cast_pattern.search(line) or any_pattern.search(line):
            any_uses.append((relpath, i, line.strip()))

# manual interfaces with table names
manual_db_types = []
iface_re = re.compile(r'export\s+(interface|type)\s+([A-Z][A-Za-z0-9_]*)')
for path in files:
    text = path.read_text(encoding='utf-8', errors='ignore')
    relpath = safe_relpath(path)
    for m in iface_re.finditer(text):
        name = m.group(2)
        if any(tbl.capitalize().replace('_','') in name or tbl.rstrip('s').capitalize() in name for tbl in tables):
            manual_db_types.append((relpath, m.group(1), name, m.start()))

# write summary
out = Path('supabase/query_audit_report.txt')
with out.open('w', encoding='utf-8') as f:
    f.write('Query Safety Report\n')
    f.write('===================\n')
    for entry in report[:200]:
        if entry[2] in ('BROKEN','UNKNOWN_TABLE'):
            f.write(str(entry) + '\n')
    f.write('\nALL QUERY ISSUES (first 200 rows):\n')
    for entry in report[:200]:
        f.write(str(entry) + '\n')
    f.write('\nANY USAGE SAMPLES:\n')
    for x in any_uses[:200]:
        f.write(str(x) + '\n')
    f.write('\nMANUAL DB-TYPE INTERFACES/TYPES:\n')
    for x in manual_db_types[:200]:
        f.write(str(x) + '\n')
print('report generated', len(report), 'from rows, any uses', len(any_uses), 'manual db types', len(manual_db_types))

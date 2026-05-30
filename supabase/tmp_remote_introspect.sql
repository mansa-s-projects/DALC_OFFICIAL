SELECT table_name, table_type FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;

SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema='public'
ORDER BY table_name, ordinal_position;

SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname='public'
ORDER BY tablename, indexname;

SELECT tc.table_name, tc.constraint_name, kcu.column_name, ccu.table_name AS foreign_table, ccu.column_name AS foreign_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema='public'
ORDER BY tc.table_name, tc.constraint_name;

SELECT cls.relname AS table_name, pol.polname AS policy_name, pg_get_expr(pol.polqual, pol.polrelid) AS using_expr, pg_get_expr(pol.polwithcheck, pol.polrelid) AS check_expr, pol.polcmd
FROM pg_policy pol
JOIN pg_class cls ON cls.oid = pol.polrelid
JOIN pg_namespace nsp ON nsp.oid = cls.relnamespace
WHERE nsp.nspname = 'public'
ORDER BY cls.relname, pol.polname;

SELECT event_object_table, trigger_name, action_timing, event_manipulation, action_statement
FROM information_schema.triggers
WHERE trigger_schema='public'
ORDER BY event_object_table, trigger_name;

SELECT proname, pg_get_functiondef(p.oid) AS definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
ORDER BY proname;

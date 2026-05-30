import { createClient } from '@supabase/supabase-js';
import { MOCK_EXPERIENCES } from '@/lib/experiences';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  // ── Experiences ──────────────────────────────────────────────────────────────
  let expCount = 0;

  for (const exp of MOCK_EXPERIENCES) {
    const { error } = await supabase
      .from('experience_services')
      .upsert(
        {
          slug:        exp.slug,
          title:       exp.name,
          subcategory: exp.subcategory,
          status:      'published',
          emirate_id:  null,
        },
        { onConflict: 'slug' },
      );

    if (error) {
      console.error(`Experience error [${exp.id}]:`, error.message);
    } else {
      expCount++;
    }
  }

  console.log(`✅ Seeded ${expCount} experiences`);
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

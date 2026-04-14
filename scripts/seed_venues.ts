import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const BASE = path.join(process.cwd(), "public", "images");

const CATEGORIES = ["beach_clubs", "restaurants", "nightclubs"];

function slugify(name: string) {
  return name.toLowerCase().replace(/_/g, "-");
}

function formatName(name: string) {
  return name.replace(/_/g, " ");
}

async function seed() {
  for (const category of CATEGORIES) {
    const categoryPath = path.join(BASE, category);

    if (!fs.existsSync(categoryPath)) continue;

    const venues = fs.readdirSync(categoryPath);

    console.log(`🔥 Seeding ${category}`);

    for (const venueFolder of venues) {
      const venuePath = path.join(categoryPath, venueFolder);
      const files = fs.readdirSync(venuePath);

      const image = files.find((f) => f.includes("image"));

      const hero = image ? `/images/${category}/${venueFolder}/${image}` : null;

      const { error } = await supabase.from("venues").upsert(
        {
          slug: slugify(venueFolder),
          name: formatName(venueFolder),
          category: category,
          hero_image: hero,
          trending_score: Math.floor(Math.random() * 100),
          status: "published",
        },
        { onConflict: "slug" },
      );

      if (error) {
        console.log("❌", venueFolder, error.message);
      } else {
        console.log("✅", venueFolder);
      }
    }
  }

  console.log("🚀 DONE");
}

seed();

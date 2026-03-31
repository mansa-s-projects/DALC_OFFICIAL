import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const CONFIG = {
  outputBase: "public/images",
  createInfoJson: true,
  createReadme: true,
  createGitkeep: true,
  imagePlaceholders: ["1.jpg", "2.jpg", "3.jpg"],
};

const dalcData = {
  explore: {
    restaurants: [
      "Trèsind Studio",
      "FZN by Björn Frantzén",
      "Row on 45",
      "STAY by Yannick Alléno",
      "Ossiano",
      "Orfali Bros",
      "Moonrise",
      "Smoked Room",
    ],
    beachClubs: [
      "Nikki Beach",
      "DRIFT Beach",
      "O Beach Dubai",
      "Playa Pacha",
      "Bohemia Dubai",
      "Tagomago",
      "SAN Beach",
      "Baoli Dubai",
      "Gigi Rigolatto",
    ],
    nightClubs: [
      "SKY2.0",
      "BLU Dubai",
      "BLING Dubai",
      "White Dubai",
      "Armani Prive",
      "Muscovites Club",
      "Gate Two by Iris",
    ],
    diningEntertainment: [
      "Krasota",
      "The Theater Dubai",
      "DREAM Dinner Show",
      "Gatsby Dubai",
      "La Perle by Dragone",
    ],
  },

  experiences: {
    marine: [
      "Private Yacht Rental",
      "Jet Ski Rental",
      "Dhow Cruise Musandam",
      "Dhow Cruise Khasab",
    ],
    aerialAdrenaline: [
      "Skydiving Palm",
      "Skydiving Desert",
      "Zip-lining Marina",
      "Sky Views Observatory",
      "Helicopter Tour 12min",
      "Helicopter Tour 17min",
      "Helicopter Tour 22min",
    ],
    desertAdventure: [
      "Sonara Camp Sunset Dinner",
      "Sonara Camp Overnight",
      "Sonara Camp Sunset",
      "Horse Riding 1H",
      "Pony Riding 30min",
      "Equestrian Signature Experience",
    ],
    wellness: [
      "Massage Relaxation",
      "Massage Aromatherapy",
      "Massage Tissue Profond",
      "Massage Balinais",
      "Massage Sportif",
      "Massage Reflexology",
      "Massage Combination",
      "Massage Lymphatic",
      "Massage Wood Therapy",
      "Massage Hot Stones",
      "Couple Massage",
    ],
    ticketsCulture: [
      "IMG World of Adventure",
      "Warner Bros Abu Dhabi",
      "Atlantis Aquaventure",
      "Atlantis Lost Chambers",
      "Wild Wadi Waterpark",
      "Yas Waterpark",
      "SeaWorld",
      "Dubai City Tour",
      "Abu Dhabi City Tour Standard",
      "Abu Dhabi City Tour Mercedes Viano",
      "Sheikh Zayed Mosque Tour",
      "Qasr Al Watan Gardens",
      "Ferrari World Abu Dhabi",
      "Louvre Abu Dhabi",
      "Flying Dress Shoot Solo",
      "Flying Dress Shoot Duo",
      "Flying Dress Shoot Couple",
      "Flying Dress Shoot Family",
      "Flying Dress Shoot Group",
    ],
    luxuryLeisure: [
      "Mercedes Classe G",
      "Porsche Carrera 911",
      "Ferrari SF90",
      "Lamborghini Aventador SVJ",
      "McLaren 720S",
      "Porsche GT3",
    ],
  },

  travel: {
    carRental: [
      "Chevrolet Tao",
      "Audi RS3",
      "Audi RSQ3",
      "Audi RSQ8",
      "Porsche Cayenne",
      "Porsche Macan",
      "Nissan Sunny",
      "Chevrolet Groove",
      "MG One",
      "Fiat Abarth",
      "Mercedes Classe A",
      "Audi A3",
      "Jetour T2",
      "Audi Q5 Sportback",
    ],
    flights: [],
    hotels: [],
    villas: [],
    privateJets: [],
  },

  concierge: {
    vipReservations: [],
    customPlanning: [],
    lifestyleManagement: [],
    personalRequests: [],
  },

  moveToDubai: {
    visaServices: [],
    companyFormation: [],
    banking: [],
    relocationSupport: [],
  },
};

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .toLowerCase();
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFileIfMissing(filePath, content = "") {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, "utf8");
  }
}

function inferTopFolder(section, subsection, itemName) {
  const lower = itemName.toLowerCase();

  if (section === "explore") return "venues";
  if (section === "travel" && subsection === "carRental") return "cars";
  if (section === "experiences" && subsection === "luxuryLeisure") return "cars";
  if (section === "experiences" && subsection === "marine" && lower.includes("yacht")) return "yachts";
  if (section === "experiences" && subsection === "marine") return "experiences";
  if (section === "experiences") return "experiences";
  if (section === "travel" && subsection === "privateJets") return "jets";
  if (section === "travel" && subsection === "villas") return "villas";
  if (section === "travel" && subsection === "hotels") return "hotels";

  return section;
}

function buildInfo(section, subsection, itemName, slug, folderType) {
  return {
    name: itemName,
    slug,
    section,
    subsection,
    folderType,
    description: "",
    shortDescription: "",
    location: "",
    tags: [],
    coverImage: `/${CONFIG.outputBase}/${folderType}/${subsection}/${slug}/1.jpg`,
    gallery: CONFIG.imagePlaceholders.map(
      (img) => `/${CONFIG.outputBase}/${folderType}/${subsection}/${slug}/${img}`
    ),
    seo: {
      title: itemName,
      description: "",
    },
  };
}

function createItemFolder(section, subsection, itemName) {
  const slug = slugify(itemName);
  const folderType = inferTopFolder(section, subsection, itemName);

  const folderPath = path.join(
    ROOT,
    CONFIG.outputBase,
    folderType,
    subsection,
    slug
  );

  ensureDir(folderPath);

  if (CONFIG.createGitkeep) {
    writeFileIfMissing(path.join(folderPath, ".gitkeep"), "");
  }

  if (CONFIG.createReadme) {
    const readme = [
      `# ${itemName}`,
      ``,
      `Section: ${section}`,
      `Subsection: ${subsection}`,
      `Slug: ${slug}`,
      ``,
      `Add images here:`,
      ...CONFIG.imagePlaceholders.map((img) => `${img}`),
      ``,
      `Update info.json with real metadata.`,
      ``,
    ].join("\n");

    writeFileIfMissing(path.join(folderPath, "README.md"), readme);
  }

  if (CONFIG.createInfoJson) {
    const info = buildInfo(section, subsection, itemName, slug, folderType);
    writeFileIfMissing(
      path.join(folderPath, "info.json"),
      JSON.stringify(info, null, 2)
    );
  }

  for (const imageName of CONFIG.imagePlaceholders) {
    writeFileIfMissing(path.join(folderPath, imageName), "");
  }

  return {
    name: itemName,
    slug,
    section,
    subsection,
    folderType,
    folderPath,
  };
}

function processBranch(sectionName, branch) {
  const results = [];

  for (const [subsection, items] of Object.entries(branch)) {
    if (!Array.isArray(items)) continue;

    for (const itemName of items) {
      results.push(createItemFolder(sectionName, subsection, itemName));
    }
  }

  return results;
}

function main() {
  const allResults = [];

  for (const [sectionName, branch] of Object.entries(dalcData)) {
    if (!branch || typeof branch !== "object") continue;
    const created = processBranch(sectionName, branch);
    allResults.push(...created);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    total: allResults.length,
    items: allResults.map((item) => ({
      name: item.name,
      slug: item.slug,
      section: item.section,
      subsection: item.subsection,
      folderType: item.folderType,
      folderPath: path.relative(ROOT, item.folderPath),
    })),
  };

  const manifestPath = path.join(ROOT, "public", "images", "manifest.json");
  ensureDir(path.dirname(manifestPath));
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");

  console.log(`Generated ${allResults.length} item folders.`);
  console.log(`Manifest written to public/images/manifest.json`);
}

main();
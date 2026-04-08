const fs = require('fs');
const path = require('path');

function walkDir(dir, cb) {
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walkDir(p, cb);
    else cb(p);
  });
}

function process() {
  ['src', 'scripts'].forEach(dir => {
    if (fs.existsSync(dir)) {
      walkDir(dir, p => {
        if (!p.endsWith('.ts') && !p.endsWith('.tsx')) return;
        
        let c = fs.readFileSync(p, 'utf8');
        let ch = false;
        
        if (c.match(/data\/(carsData|car_sections\.json|yachts\.json|yachtsData)/)) {
          const replaced = c.replace(/(['"](?:(?:\.\.\/)+|@\/)data\/)(carsData|car_sections\.json|yachts\.json|yachtsData)(['"])/g, "$1transport/$2$3");
          if (replaced !== c) {
            c = replaced;
            ch = true;
          }
        }
        
        if (c.match(/data\/(mockData|skillsMapping|venueAliasMap|venueCoordinates|venueImages|venuesData)/)) {
          const replaced = c.replace(/(['"](?:(?:\.\.\/)+|@\/)data\/)(mockData|skillsMapping|venueAliasMap|venueCoordinates|venueImages|venuesData)(['"])/g, "$1venues/$2$3");
          if (replaced !== c) {
            c = replaced;
            ch = true;
          }
        }
        
        if (p.replace(/\\/g, '/').match(/\/data\/(venues|transport)\/.+\.(ts|tsx)$/)) {
          if (c.match(/(['"])\.\.\/(types|lib|components|hooks|store|data|features)/)) {
            const replaced = c.replace(/(['"])\.\.\/(types|lib|components|hooks|store|data|features)/g, "$1../../$2");
            if (replaced !== c) {
              c = replaced;
              ch = true;
            }
          }
        }
        
        if (ch) {
          fs.writeFileSync(p, c, 'utf8');
        }
      });
    }
  });
}

process();
console.log('done');

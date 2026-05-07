const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      // not traversing deeply
    } else {
      if (res.includes('Guide') && res.endsWith('.tsx')) {
        files.push(res);
      }
    }
  }
  return files;
}

const files = getFiles(path.resolve(__dirname, 'src/components'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');

  // Insert imports missing
  if (!content.includes("import { ROUTES } from '../constants/routes';") && !content.includes('import { ROUTES }')) {
     content = content.replace(/import \{ Link \} from 'react-router-dom';/, "import { Link } from 'react-router-dom';\nimport { ROUTES } from '../constants/routes';");
  }

  content = content.replace(/import LeadMagnetBlock from '\.\/LeadMagnetBlock';/g, "import SaaSCtaBlock from './LeadMagnetBlock';");
  content = content.replace(/<LeadMagnetBlock \/>/g, "<SaaSCtaBlock />");

  // 2. Replace Telegram Sidebar Block
  const telegramRegex = /<div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl border border-slate-800">[\s\S]*?(?:Canal Telegram|Estrategias en Telegram|t\.me)[\s\S]*?<\/div>/g;
  
  const optimizedSidebarCta = `<div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl border border-slate-800">
                <span className="text-brand-300 text-xs font-bold uppercase tracking-widest mb-4 block">Herramientas Pro</span>
                <h3 className="font-serif text-2xl font-bold mb-4">Analiza sin Riesgo</h3>
                <p className="text-slate-300 mb-8 text-sm leading-relaxed">
                    ¿Dudas con una puja? Nuestro algoritmo analiza cargas, ITP y valor real en segundos. Evita sorpresas y puja con seguridad matemática.
                </p>
                <Link 
                    to={ROUTES.PRO}
                    className="block w-full bg-brand-500 text-white font-bold py-4 px-4 rounded-xl text-center hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
                >
                    Ver Planes y Precios <ArrowRight size={16}/>
                </Link>
            </div>`;
          
  content = content.replace(telegramRegex, optimizedSidebarCta);
  
  fs.writeFileSync(file, content);
}
console.log("Replaced CTAs in", files.length, "files");

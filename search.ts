import fs from 'fs';
import path from 'path';

function search(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git') continue;
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            search(fullPath);
        } else {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('git commit') || content.includes('github-actions') || content.includes('Modificar el bloque') || content.includes('origin main')) {
                console.log(`Found in: ${fullPath}`);
            }
        }
    }
}
search('.');

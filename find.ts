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
            if (fullPath.endsWith('.sh') || fullPath.endsWith('.yml')) {
                console.log(fullPath);
            }
        }
    }
}
search('.');

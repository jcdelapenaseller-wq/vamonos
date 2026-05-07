import fs from 'fs';
import path from 'path';

function walk(dir: string, indent: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git') continue;
        const fullPath = path.join(dir, file);
        const isDir = fs.statSync(fullPath).isDirectory();
        if (isDir) {
            console.log(indent + file + '/');
            walk(fullPath, indent + '  ');
        } else {
            if (fullPath.includes('.yml') || fullPath.includes('.yaml') || fullPath.includes('github') || fullPath.includes('workflow')) {
                console.log(indent + file);
            }
        }
    }
}
console.log("Starting walk...");
walk('.', '');

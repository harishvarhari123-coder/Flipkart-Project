import fs from 'fs';
import path from 'path';

function getActualCasePath(filepath) {
    const parts = filepath.split(path.sep);
    let currentPath = parts[0] + path.sep; // Drive letter or root
    for (let i = 1; i < parts.length; i++) {
        if (!parts[i]) continue;
        const items = fs.readdirSync(currentPath);
        const match = items.find(item => item.toLowerCase() === parts[i].toLowerCase());
        if (!match) return null; // File doesn't exist even case-insensitively
        if (match !== parts[i]) return null; // Case mismatch
        currentPath = path.join(currentPath, match);
    }
    return currentPath;
}

function checkDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            checkDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, index) => {
                const match = line.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/);
                if (match) {
                    const importPath = match[1];
                    if (importPath.startsWith('.')) {
                        const resolvedDir = path.dirname(fullPath);
                        let targetPath = path.join(resolvedDir, importPath);
                        
                        let found = false;
                        const extensions = ['', '.jsx', '.js', '.css', '/index.jsx', '/index.js'];
                        for (const ext of extensions) {
                            const testPath = targetPath + ext;
                            if (fs.existsSync(testPath)) {
                                const actual = getActualCasePath(testPath);
                                if (!actual) {
                                    console.log(`CASE MISMATCH in ${fullPath}:${index + 1}`);
                                    console.log(`  Imported: ${importPath}`);
                                }
                                found = true;
                                break;
                            }
                        }
                    }
                }
            });
        }
    }
}

checkDirectory(path.join(process.cwd(), 'src'));
console.log('Smart check complete.');

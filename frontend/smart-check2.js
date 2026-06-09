import fs from 'fs';
import path from 'path';

function getActualCasePath(filepath) {
    const parts = filepath.split(path.sep);
    let currentPath = parts[0] + path.sep;
    for (let i = 1; i < parts.length; i++) {
        if (!parts[i]) continue;
        const items = fs.readdirSync(currentPath);
        const match = items.find(item => item.toLowerCase() === parts[i].toLowerCase());
        if (!match) return null;
        if (match !== parts[i]) return null; // exact case match failed
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
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, index) => {
                // Check both `import ... from '...'` and `import '...'`
                const match1 = line.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/);
                const match2 = line.match(/import\s+['"]([^'"]+)['"]/);
                
                let importPath = null;
                if (match1) importPath = match1[1];
                else if (match2) importPath = match2[1];
                
                if (importPath && importPath.startsWith('.')) {
                    const resolvedDir = path.dirname(fullPath);
                    let targetPath = path.join(resolvedDir, importPath);
                    
                    const extensions = ['', '.jsx', '.js', '.css', '/index.jsx', '/index.js'];
                    for (const ext of extensions) {
                        const testPath = targetPath + ext;
                        if (fs.existsSync(testPath)) {
                            const actual = getActualCasePath(testPath);
                            if (!actual) {
                                console.log(`CASE MISMATCH in ${fullPath}:${index + 1}`);
                                console.log(`  Imported: ${importPath}`);
                            }
                            break;
                        }
                    }
                }
            });
        }
    }
}

checkDirectory(path.join(process.cwd(), 'src'));
console.log('Smart check complete.');

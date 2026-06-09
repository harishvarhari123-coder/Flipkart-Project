import fs from 'fs';
import path from 'path';

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
                const match = line.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/);
                if (match) {
                    const importPath = match[1];
                    if (importPath.startsWith('.')) {
                        const resolvedDir = path.dirname(fullPath);
                        let targetPath = path.join(resolvedDir, importPath);
                        
                        // Check if file exists with exact case
                        let exists = false;
                        let foundCase = null;
                        
                        // Try exact file first
                        const extensions = ['', '.jsx', '.js', '.css', '/index.jsx', '/index.js'];
                        for (const ext of extensions) {
                            const testPath = targetPath + ext;
                            if (fs.existsSync(testPath)) {
                                // On Windows, existsSync is case-insensitive, so we must check actual directory listing
                                const dirname = path.dirname(testPath);
                                const basename = path.basename(testPath);
                                if (fs.existsSync(dirname)) {
                                    const actualFiles = fs.readdirSync(dirname);
                                    if (actualFiles.includes(basename)) {
                                        exists = true;
                                        break;
                                    } else {
                                        // Case mismatch!
                                        foundCase = actualFiles.find(f => f.toLowerCase() === basename.toLowerCase());
                                        if (foundCase) {
                                            console.log(`CASE MISMATCH in ${fullPath}:${index + 1}`);
                                            console.log(`  Imported: ${importPath}`);
                                            console.log(`  Actual file: ${foundCase}`);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    }
}

checkDirectory(path.join(process.cwd(), 'src'));
console.log('Check complete.');

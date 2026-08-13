const { resolve } = require('path');
const fs = require('fs');

function getHtmlEntries(dir) {
    const entries = {};
    const dirPath = resolve(__dirname, dir);
    console.log(`Scanning directory: ${dirPath}`);

    if (!fs.existsSync(dirPath)) {
        console.log("Directory does not exist");
        return entries;
    }

    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        if (file.endsWith('.html')) {
            const name = file.replace('.html', '');
            entries[name] = resolve(dirPath, file);
            console.log(`Found entry: ${name} -> ${entries[name]}`);
        }
    });
    return entries;
}

const inputs = {
    main: resolve(__dirname, 'index.html'),
    ...getHtmlEntries('pages')
};

console.log("Final Input Config:", inputs);

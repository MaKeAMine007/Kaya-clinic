const fs = require('fs');
const path = require('path');

const dir = "c:\\Users\\omshi\\OneDrive\\Desktop\\MakeAMine\\a-one-clinic";

const target = "q=Doctor+Centre+206+August+Kranti+Road+Kemps+Corner+New Delhi+400026";
const replacement = "q=Dariy+No+87+Masoodpur+Vasant+Kunj+New+Delhi+Delhi+110070";

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== '.git' && file !== '.vercel' && file !== '.agents') {
                walk(fullPath);
            }
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(target)) {
                content = content.replace(new RegExp(target.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replacement);
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated map in: ${file}`);
            }
        }
    }
}

walk(dir);
console.log("Map replacement complete!");

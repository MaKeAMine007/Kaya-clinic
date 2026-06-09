const fs = require('fs');
const path = require('path');

const dir = "c:\\Users\\omshi\\OneDrive\\Desktop\\MakeAMine\\a-one-clinic";
const target = "<title>A One Clinic | Expert Dermatologist in New Delhi</title>";
const replacement = "<title>A One Clinic | Medical, General &amp; Skin Clinic in Vasant Kunj, New Delhi</title>";

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
                console.log(`Updated title in: ${file}`);
            }
        }
    }
}

walk(dir);
console.log("Title replacement complete!");

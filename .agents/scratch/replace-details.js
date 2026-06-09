const fs = require('fs');
const path = require('path');

const dir = "c:\\Users\\omshi\\OneDrive\\Desktop\\MakeAMine\\a-one-clinic";

const replacements = [
    // 1. Emails
    { search: /contact@drramchandaniclinic\.com/g, replace: "contact@aoneclinic.com" },
    { search: /info@drramchandaniclinic\.com/g, replace: "info@aoneclinic.com" },
    
    // 2. Phone numbers (link & display)
    { search: /tel:\+919892285612/g, replace: "tel:+919625486742" },
    { search: /tel:\+91123456789/g, replace: "tel:+919625486742" }, // standardizes service-detail.html bug
    { search: /\+91 98922 85612/g, replace: "+91 96254 86742" },
    
    // 3. Address
    { search: /Doctor Centre, 206, August Kranti Rd, Kemps Corner, Mumbai 400026/g, replace: "Dariy No 87, Masoodpur, Vasant Kunj, New Delhi, Delhi 110070" },
    
    // 4. Working hours in index.html
    { 
        search: /<p>Monday - Friday : 9:00 am to 6:00 pm<\/p>\s*<p>Saturday : 11:00 am to 5pm<\/p>/g,
        replace: "<p>Monday - Sunday : 9:00 AM to 9:00 PM</p>"
    },
    
    // 5. Rating widget in index.html
    {
        search: /<p>I am beyond thrilled with the results of my facelift\. <\/p>\s*<span>5\.0<i class="fa-solid fa-star"><\/i><\/span>/g,
        replace: "<p>Google Rating (Based on Justdial reviews)</p><span>4.0<i class=\"fa-solid fa-star\"></i></span>"
    },

    // 6. Keywords
    {
        search: /dermatologist Mumbai, skin clinic Kemps Corner, acne treatment, chemical peels, skin specialist Mumbai, Dr Ramchandani/g,
        replace: "general physician Vasant Kunj, medical clinic Vasant Kunj, skin clinic Vasant Kunj, A One Clinic New Delhi, family doctor Vasant Kunj"
    },
    
    // 7. Meta descriptions & descriptions
    {
        search: /Dr\. Ramchandani's Clinic offers expert dermatology &amp; skin care treatments at Kemps Corner, Mumbai\. Book your appointment: \+91 98922 85612/g,
        replace: "A One Clinic offers professional medical, general &amp; skin care treatments in Masoodpur, Vasant Kunj, New Delhi. Book your appointment: +91 96254 86742"
    },
    {
        search: /Dr\. Ramchandani's Clinic offers expert dermatology & skin care treatments at Kemps Corner, Mumbai\. Book your appointment: \+91 98922 85612/g,
        replace: "A One Clinic offers professional medical, general & skin care treatments in Masoodpur, Vasant Kunj, New Delhi. Book your appointment: +91 96254 86742"
    },
    {
        search: /Dr\. Ramchandani's Clinic brings expert dermatology &amp; advanced skin care to Kemps Corner, Mumbai\./g,
        replace: "A One Clinic brings professional medical, general &amp; advanced skin care treatments to Vasant Kunj, New Delhi."
    },
    {
        search: /Dr\. Ramchandani's Clinic brings expert dermatology & advanced skin care to Kemps Corner, Mumbai\./g,
        replace: "A One Clinic brings professional medical, general & advanced skin care treatments to Vasant Kunj, New Delhi."
    },

    // 8. General clinic name replacements
    { search: /Dr\. Ramchandani's Clinic/g, replace: "A One Clinic" },
    { search: /Dr\. Ramchandani’s Clinic/g, replace: "A One Clinic" },
    { search: /Dr\. Ramchandani's/g, replace: "A One Clinic" },
    { search: /Dr\. Ramchandani’s/g, replace: "A One Clinic" },
    { search: /Dr\. Ramchandani/g, replace: "A One Clinic" },
    { search: /Dr Ramchandani/g, replace: "A One Clinic" },
    { search: /Dr\. Ramchandani/g, replace: "A One Clinic" },

    // 9. Specific location details in headers / paragraphs
    { search: /Kemps Corner, Mumbai/g, replace: "Vasant Kunj, New Delhi" },
    { search: /Kemps Corner/g, replace: "Vasant Kunj" },
    { search: /Mumbai/g, replace: "New Delhi" },
    
    // 10. General text
    { search: /dermatology &amp; skin care/g, replace: "medical, general &amp; skin care" },
    { search: /dermatology & skin care/g, replace: "medical, general & skin care" },
    { search: /dermatology services/g, replace: "medical &amp; skin care services" },
    { search: /dermatology services/g, replace: "medical & skin care services" }
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    for (const r of replacements) {
        if (r.search.test(content)) {
            content = content.replace(r.search, r.replace);
            modified = true;
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${path.basename(filePath)}`);
    } else {
        console.log(`No changes needed: ${path.basename(filePath)}`);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Skip folders we don't care about (though we already excluded them in copy)
            if (file !== '.git' && file !== '.vercel' && file !== '.agents') {
                walk(fullPath);
            }
        } else if (file.endsWith('.html')) {
            processFile(fullPath);
        }
    }
}

console.log(`Running details replacement in ${dir}...`);
walk(dir);
console.log('Replacement complete!');

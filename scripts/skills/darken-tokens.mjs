import fs from 'fs';
import path from 'path';

function invertHex(hex) {
    if (hex.indexOf('#') === 0) hex = hex.slice(1);
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    if (hex.length !== 6) return '#' + hex;

    let r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16);
    let g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16);
    let b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);

    // Padding
    r = r.length === 1 ? '0' + r : r;
    g = g.length === 1 ? '0' + g : g;
    b = b.length === 1 ? '0' + b : b;

    return '#' + r + g + b;
}

function traverse(darkObj, lightObj) {
    for (const key in darkObj) {
        if (typeof darkObj[key] === 'object' && darkObj[key] !== null) {
            const valDark = darkObj[key].value || darkObj[key].$value;
            const valLight = lightObj[key]?.value || lightObj[key]?.$value;
            const typeDark = darkObj[key].type || darkObj[key].$type;

            if (valDark !== undefined && valLight !== undefined) {
                if (
                    typeof valDark === 'string' &&
                    valDark.startsWith('#') &&
                    valDark === valLight &&
                    typeDark === 'color'
                ) {
                    const inverted = invertHex(valDark);
                    if (darkObj[key].hasOwnProperty('$value')) darkObj[key].$value = inverted;
                    else darkObj[key].value = inverted;
                    console.log(`Inverted static color for ${key}`);
                }
            } else {
                traverse(darkObj[key], lightObj[key] || {});
            }
        }
    }
}

const darkPath = path.resolve(process.cwd(), 'packages/tokens/src/tokens-dark.json');
const lightPath = path.resolve(process.cwd(), 'packages/tokens/src/tokens-light.json');

const darkJson = JSON.parse(fs.readFileSync(darkPath, 'utf8'));
const lightJson = JSON.parse(fs.readFileSync(lightPath, 'utf8'));

traverse(darkJson, lightJson);

fs.writeFileSync(darkPath, JSON.stringify(darkJson, null, 2), 'utf8');
console.log('Mathematical Dark Mode Token Sync Complete.');

import fs from 'fs';

try {
  let mod1 = fs.readFileSync('src/data/lessons/module1.tsx', 'utf-8');
  mod1 = mod1.replace(/ResolutionComparison,/g, '');
  mod1 = mod1.replace(/<ResolutionComparison \/>/g, '');
  fs.writeFileSync('src/data/lessons/module1.tsx', mod1);
  console.log('Fixed module1');
} catch (e) {
  console.error('Failed module1', e);
}

try {
  let mod2 = fs.readFileSync('src/data/lessons/module2.tsx', 'utf-8');
  mod2 = mod2.replace(/BeamLab,/g, '');
  mod2 = mod2.replace(/<BeamLab \/>/g, '');
  fs.writeFileSync('src/data/lessons/module2.tsx', mod2);
  console.log('Fixed module2');
} catch (e) {
  console.error('Failed module2', e);
}

try {
  let mod3 = fs.readFileSync('src/data/lessons/module3.tsx', 'utf-8');
  mod3 = mod3.replace(/md:row/g, 'md:flex-row');
  fs.writeFileSync('src/data/lessons/module3.tsx', mod3);
  console.log('Fixed module3');
} catch (e) {
  console.error('Failed module3', e);
}

console.log('Done');

import {writeFile} from 'node:fs/promises';
import {schoolBadge,brandLogo} from '../src/pixel-marks.js';

for(const id of ['aero','normal','finance']){
  await writeFile(new URL(`../assets/school-${id}.svg`,import.meta.url),schoolBadge(id)+'\n');
}
for(const name of ['brand-logo','favicon']){
  await writeFile(new URL(`../assets/${name}.svg`,import.meta.url),brandLogo()+'\n');
}

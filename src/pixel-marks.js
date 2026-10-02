// Original pixel emblems, deliberately unrelated to real university seals.
const r=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
const frame=c=>`<path d="M10 2h28v4h6v6h2v24h-2v6h-6v4H10v-4H4v-6H2V12h2V6h6z" fill="${c}"/>`;
export function schoolBadge(id){
  const icons={
    aero:frame('#486e71')+`<path d="M12 9h24v3h5v24h-5v3H12v-3H7V12h5z" fill="#7ca6a2"/>`+
      `<path d="M4 26h9v-4h8v-4h6v4h8v4h9v4H32v4H16v-4H4z" fill="#fff0c9"/>`+
      r(22,14,4,20,'#fff0c9')+r(20,17,8,6,'#fff0c9')+r(22,26,4,4,'#486e71')+
      `<path d="M8 21V13h3v-3h8M29 38h8v-3h3v-6" fill="none" stroke="#dcba6b" stroke-width="2"/>`+
      r(33,7,2,8,'#ffe1a0')+r(30,10,8,2,'#ffe1a0'),
    normal:frame('#698456')+`<path d="M10 9h28v3h3v24h-3v3H10v-3H7V12h3z" fill="#a9be7e"/>`+
      r(21,8,6,6,'#e4ae63')+r(23,13,2,8,'#55794f')+
      `<path d="M22 18h-7v-5h7v5h4v-7h7v5h-7v7h-4z" fill="#55794f"/>`+
      `<path d="M7 24h12v2h10v-2h12v14H29v3H19v-3H7z" fill="#476e55"/>`+
      `<path d="M10 23h10v2h3v12h-3v-2H10zM25 25h3v-2h10v12H28v2h-3z" fill="#fff3cf"/>`+
      r(12,27,6,2,'#b5ba84')+r(12,31,6,2,'#b5ba84')+r(30,27,6,2,'#b5ba84')+r(30,31,6,2,'#b5ba84'),
    finance:frame('#9a7651')+`<path d="M10 9h28v3h3v24h-3v3H10v-3H7V12h3z" fill="#d7b778"/>`+
      `<path d="M8 17v-3h6v-3h6V8h8v3h6v3h6v3z" fill="#fff1c9"/>`+
      r(10,19,4,14,'#fff1c9')+r(20,19,4,14,'#fff1c9')+r(30,19,4,14,'#fff1c9')+
      r(8,34,30,4,'#fff1c9')+
      `<path d="M26 31v-4h3v-4h3v-4h4v-4h6v9h-3v5h-6v4h-5v3h-3z" fill="#536f61"/>`+
      `<path d="M27 35l12-16" fill="none" stroke="#a8c299" stroke-width="2"/>`
  };
  return `<svg class="school-badge-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" shape-rendering="crispEdges" aria-hidden="true">${icons[id]||icons.aero}</svg>`;
}
export function brandLogo(){
  return `<svg class="brand-logo-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" shape-rendering="crispEdges" aria-hidden="true">${r(0,0,40,40,'#f7edce')}<path d="M4 13h5v-3h6V7h10v3h6v3h5v4h-5v3H9v-3H4z" fill="#3e6650"/>${r(13,19,14,5,'#6e9366')+r(33,17,2,8,'#cd9a47')+r(32,24,4,4,'#cd9a47')}<path d="M6 34v-4h7v-4h7v-3h7v5h-7v4h-7v4H6z" fill="#cd9a47"/>${r(5,37,30,2,'#a8bb86')}</svg>`;
}

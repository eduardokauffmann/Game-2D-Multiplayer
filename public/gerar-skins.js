const fs = require('fs');
const path = require('path');

const skinsDir = path.join(__dirname, 'public', 'skins');
if (!fs.existsSync(skinsDir)) {
  fs.mkdirSync(skinsDir, { recursive: true });
}

const skins = [
  // 1. Escudo Estelar (Capitão)
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#1d4ed8"/><circle cx="50" cy="50" r="39" fill="#ef4444"/><circle cx="50" cy="50" r="29" fill="#ffffff"/><circle cx="50" cy="50" r="20" fill="#1d4ed8"/><polygon points="50,32 54.5,45 68,45 57,53 61,66 50,58 39,66 43,53 32,45 45.5,45" fill="#ffffff"/></svg>`,
  // 2. Baiacu Espinhoso
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#b45309"/><path d="M0,52 Q50,64 100,52 L100,100 L0,100 Z" fill="#fef3c7"/><circle cx="33" cy="39" r="9" fill="#fff"/><circle cx="33" cy="39" r="4" fill="#000"/><circle cx="67" cy="39" r="9" fill="#fff"/><circle cx="67" cy="39" r="4" fill="#000"/><ellipse cx="50" cy="57" rx="10" ry="12" fill="#451a03"/></svg>`,
  // 3. Poké-Esfera
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#ffffff"/><path d="M0,50 A50,50 0 0,1 100,50 Z" fill="#ef4444"/><rect x="0" y="45" width="100" height="10" fill="#111827"/><circle cx="50" cy="50" r="15" fill="#111827"/><circle cx="50" cy="50" r="9" fill="#ffffff"/></svg>`,
  // 4. Planeta Terra
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#0284c7"/><path d="M18,24 Q40,14 48,35 T34,62 Q16,56 18,24 Z" fill="#22c55e"/><path d="M60,44 Q82,38 86,65 T62,84 Q50,66 60,44 Z" fill="#22c55e"/></svg>`,
  // 5. Melancia
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#15803d"/><circle cx="50" cy="50" r="42" fill="#dcfce7"/><circle cx="50" cy="50" r="37" fill="#f43f5e"/><circle cx="38" cy="38" r="2.5" fill="#111"/><circle cx="62" cy="38" r="2.5" fill="#111"/><circle cx="50" cy="55" r="2.5" fill="#111"/><circle cx="38" cy="65" r="2.5" fill="#111"/><circle cx="62" cy="65" r="2.5" fill="#111"/></svg>`,
  // 6. Olho Místico
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#f8fafc"/><circle cx="50" cy="50" r="27" fill="#7c3aed"/><circle cx="50" cy="50" r="13" fill="#090d16"/><circle cx="42" cy="40" r="5" fill="#ffffff"/></svg>`,
  // 7. Donut Morango
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#d97706"/><circle cx="50" cy="50" r="42" fill="#f472b6"/><circle cx="50" cy="50" r="16" fill="#070d19"/><rect x="25" y="25" width="8" height="3" rx="1.5" fill="#fef08a"/><rect x="65" y="30" width="8" height="3" rx="1.5" fill="#38bdf8"/><rect x="30" y="70" width="8" height="3" rx="1.5" fill="#a7f3d0"/></svg>`,
  // 8. Bola 8
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#111827"/><circle cx="50" cy="50" r="23" fill="#ffffff"/><text x="50" y="59" font-size="28" font-family="Arial" font-weight="bold" text-anchor="middle" fill="#111827">8</text></svg>`,
  // 9. Alien Tóxico
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#84cc16"/><ellipse cx="34" cy="45" rx="9" ry="14" transform="rotate(-15 34 45)" fill="#090d16"/><ellipse cx="66" cy="45" rx="9" ry="14" transform="rotate(15 66 45)" fill="#090d16"/><path d="M40,70 Q50,78 60,70" stroke="#090d16" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,
  // 10. Lava Vulcânica
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#7f1d1d"/><circle cx="50" cy="50" r="36" fill="#ea580c"/><circle cx="50" cy="50" r="20" fill="#facc15"/></svg>`,
  // 11. Ninja Sombrio
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#1e293b"/><rect x="8" y="34" width="84" height="24" rx="10" fill="#f8fafc"/><circle cx="35" cy="46" r="5" fill="#ef4444"/><circle cx="65" cy="46" r="5" fill="#ef4444"/></svg>`,
  // 12. Abelha Rainha
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#facc15"/><rect x="0" y="22" width="100" height="12" fill="#111827"/><rect x="0" y="46" width="100" height="12" fill="#111827"/><rect x="0" y="70" width="100" height="12" fill="#111827"/></svg>`,
  // 13. Alvo Neon
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#06b6d4"/><circle cx="50" cy="50" r="36" fill="#0f172a"/><circle cx="50" cy="50" r="24" fill="#ec4899"/><circle cx="50" cy="50" r="11" fill="#ffffff"/></svg>`,
  // 14. Fantasma Boo
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#e2e8f0"/><circle cx="36" cy="40" r="6" fill="#0f172a"/><circle cx="64" cy="40" r="6" fill="#0f172a"/><ellipse cx="50" cy="60" rx="12" ry="9" fill="#0f172a"/><path d="M44,62 Q50,74 56,62 Z" fill="#f43f5e"/></svg>`,
  // 15. Sol Radiante
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#f97316"/><circle cx="50" cy="50" r="35" fill="#fde047"/><circle cx="38" cy="44" r="4" fill="#7c2d12"/><circle cx="62" cy="44" r="4" fill="#7c2d12"/><path d="M38,58 Q50,68 62,58" stroke="#7c2d12" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`
];

skins.forEach((svg, index) => {
  const filePath = path.join(skinsDir, `skin${index + 1}.svg`);
  fs.writeFileSync(filePath, svg, 'utf8');
});

console.log('15 skins criadas com sucesso em public/skins/!');
const cachedFonts = new Map();

export async function loadFont(name, url) {
  if (cachedFonts.has(name)) {
    return cachedFonts.get(name);
  }

  const font = new FontFace(name, `url(${url})`);
  const loadedFont = await font.load();
  document.fonts.add(loadedFont);
  cachedFonts.set(name, loadedFont);
  return loadedFont;
}

export async function loadFonts(fonts) {
  return Promise.all(fonts.map(({ name, url }) => loadFont(name, url)));
}

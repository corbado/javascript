export enum CorbadoThemes {
  EmeraldFunk = 'emerald-funk',
}

const themesList: Record<CorbadoThemes, () => void> = {
  'emerald-funk': () => void 0, //import(''),
};

export const loadTheme = (theme: CorbadoThemes) => {
  if (themesList[theme]) {
    themesList[theme]();
  }
};

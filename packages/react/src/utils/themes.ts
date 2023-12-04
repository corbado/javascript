const themesList: Record<string, string> = {
  'emerald-funk': '../styles/themes/emerald-funk.css',
};

export const loadTheme = (theme: string) => {
  if (themesList[theme]) {
    import(themesList[theme]);
  }
};

export enum CorbadoThemes {
  EmeraldFunk = 'emerald-funk',
}

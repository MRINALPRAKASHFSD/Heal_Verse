import { Theme } from '../enums/theme.enums';

export function isTheme(value: string): value is Theme {
  return Object.values(Theme).includes(value as Theme);
}

export function getThemeLabel(theme: Theme): string {
  switch (theme) {
    case Theme.Light:
      return 'Light';
    case Theme.Dark:
      return 'Dark';
    case Theme.System:
      return 'System';
  }
}

export function resolveThemePreference(theme: Theme, systemPreference: Theme.Dark | Theme.Light): Theme.Dark | Theme.Light {
  return theme === Theme.System ? systemPreference : theme;
}
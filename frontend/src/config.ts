// types
import { DefaultConfigProps, MenuOrientation, ThemeDirection, ThemeMode } from 'types/config';

// ==============================|| THEME CONSTANT ||============================== //

export const twitterColor = '#1DA1F2';
export const facebookColor = '#3b5998';
export const linkedInColor = '#0e76a8';

export const APP_DEFAULT_PATH = '/funil/produtos';
export const HORIZONTAL_MAX_ITEM = 6;
export const DRAWER_WIDTH = 280;
export const MINI_DRAWER_WIDTH = 90;
export const HEADER_HEIGHT = 74;

// ==============================|| THEME CONFIG ||============================== //

const config: DefaultConfigProps & {
  i18n: any;
} = {
  fontFamily: `Inter var`,
  i18n: 'pt',
  menuOrientation: MenuOrientation.VERTICAL,
  menuCaption: true,
  miniDrawer: true,
  container: false,
  mode: ThemeMode.LIGHT,
  presetColor: 'default',
  themeDirection: ThemeDirection.LTR,
  themeContrast: false
} as any;

export default config;

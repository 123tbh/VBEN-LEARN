/**
 * Vite plugin for website theme color switching
 * https://github.com/anncwb/vite-plugin-theme
 */
import { viteThemePlugin, mixLighten, mixDarken, tinycolor } from 'vite-plugin-theme';
import { getThemeColors, generateColors } from '../../config/themeConfig';

export function configThemePlugin() {
  const colors = generateColors({
    mixDarken,
    mixLighten,
    tinycolor,
  });

  const plugin = viteThemePlugin({
    // ↓之前生成的很多个颜色
    colorVariables: [...getThemeColors(), ...colors],
  });
  return plugin;
}

import type { Plugin } from 'vite';
import type { ViteEnv } from '../../utils';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
import { configHtmlPlugin } from './html';
import { configSvgIconsPlugin } from './svgSprite';
import { configWindiCssPlugin } from './windicss';
import { configMockPlugin } from './mock';
import PurgeIcons from 'vite-plugin-purge-icons';
import { configStyleImportPlugin } from './styleImport';
import { configVisualizerConfig } from './visualizer';
import { configThemePlugin } from './theme';
import { configImageminPlugin } from './imagemin';

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_USE_IMAGEMIN, VITE_USE_MOCK, VITE_LEGACY, VITE_BUILD_COMPRESS } = viteEnv;
  if (isBuild) {
    //vite-plugin-imagemin
    VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin());
  }
  // vite-plugin-style-import
  vitePlugins.push(configStyleImportPlugin());
  //vite-plugin-theme
  vitePlugins.push(configThemePlugin());
  // rollup-plugin-visualizer
  vitePlugins.push(configVisualizerConfig());
  // vite-plugin-purge-icons
  vitePlugins.push(PurgeIcons());
  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild));
  // vite-plugin-windicss
  vitePlugins.push(configWindiCssPlugin());
  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin(isBuild));
  const vitePlugins: (Plugin | Plugin[])[] = [];
  return vitePlugins;
}


/**
 *  Vite Plugin for fast creating SVG sprites.
 * https://github.com/anncwb/vite-plugin-svg-icons
 */

 import SvgIconsPlugin from 'vite-plugin-svg-icons';
 import path from 'path';
 
 export function configSvgIconsPlugin(isBuild: boolean) {
   const svgIconsPlugin = SvgIconsPlugin({
     // ↓本地svg图片地址
     iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
     svgoOptions: isBuild,
     // 图标ID的样式
     symbolId: 'icon-[dir]-[name]',
   });
   return svgIconsPlugin;
 }
 
 
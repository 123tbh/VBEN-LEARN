// ↓默认颜色
export const primaryColor = '#0960bd';

// ↓默认主题
export const themeMode = 'light';

// ↓主题类型
export type ThemeMode = 'dark' | 'light';

// ↓一个解决临时检查的方法类型
type Fn = (...arg: any) => any;

// ↓Vite生成颜色组的方法参数，颜色这一块有点深奥了，不做细的研究，感兴趣的同学自己看看源码吧
export interface GenerateColorsParams {
  mixLighten: Fn;
  mixDarken: Fn;
  tinycolor: any;
  color?: string;
}
import { generate } from '@ant-design/colors';

export function generateAntColors(color: string, mode: ThemeMode) {
  return generate(color, {
    theme: mode == 'dark' ? 'dark' : 'default',
  });
}
export function getThemeColors(color?: string, theme?: ThemeMode) {
  const tc = color || primaryColor;
  const tm = theme || themeMode;
  // ↓传入的颜色根据主题生成10个颜色系列
  const colors = generateAntColors(tc, tm);
  // ↓取10个颜色的第6个作为主颜色
  const primary = colors[5];
  // ↓再使用主颜色根据主题生成10个颜色系列
  const modeColors = generateAntColors(primary, tm === 'dark' ? 'light' : 'dark');

  // ↓输出这20个颜色
  return [...colors, ...modeColors];
}
export function generateColors({
  color = primaryColor,
  mixLighten,
  mixDarken,
  tinycolor,
}: GenerateColorsParams) {
  const arr = new Array(19).fill(0);
  const lightens = arr.map((t, i) => {
    return mixLighten(color, i / 5);
  });

  const darkens = arr.map((t, i) => {
    return mixDarken(color, i / 5);
  });

  const alphaColors = arr.map((t, i) => {
    return tinycolor(color)
      .setAlpha(i / 20)
      .toRgbString();
  });

  const tinycolorLightens = arr
    .map((t, i) => {
      return tinycolor(color)
        .lighten(i * 5)
        .toHexString();
    })
    .filter((item) => item !== '#ffffff');

  const tinycolorDarkens = arr
    .map((t, i) => {
      return tinycolor(color)
        .darken(i * 5)
        .toHexString();
    })
    .filter((item) => item !== '#000000');
  return [...lightens, ...darkens, ...alphaColors, ...tinycolorDarkens, ...tinycolorLightens];
}
  
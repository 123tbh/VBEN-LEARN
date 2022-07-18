import type { App } from 'vue';

// 将window对象的TS检查扩展一个`__APP__`
declare global {
  declare interface Window {
    // Global vue app instance
    __APP__: App<Element>;
  }
}

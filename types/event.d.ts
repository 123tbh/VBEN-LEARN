// 扩展Event为ChangeEvent。全局可使用
declare interface ChangeEvent extends Event {
  target: HTMLInputElement;
}

// 车轮事件???目前代码中没有用到
declare interface WheelEvent {
  path?: EventTarget[];
}

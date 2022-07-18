import { upperFirst } from 'lodash-es';

export interface ViewportOffsetResult {
  left: number;
  top: number;
  right: number;
  bottom: number;
  rightIncludeBody: number;
  bottomIncludeBody: number;
}

export function getBoundingClientRect(element: Element): DOMRect | number {
  // 如果元素不存在、或者getBoundingClientRect方法不存在，直接返回0
  if (!element || !element.getBoundingClientRect) {
    return 0;
  }
  // 执行元素的getBoundingClientRect方法
  // https://developer.mozilla.org/zh-CN/docs/web/api/element/getboundingclientrect
  // 返回元素的大小及其相对于视口的位置。
  return element.getBoundingClientRect();
}

// 去除前后空格、BOM字节顺序标记、回车等
function trim(string: string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}

/* istanbul ignore next */
export function hasClass(el: Element, cls: string) {
  // 如果两个参数不存在，直接返回false
  if (!el || !cls) return false;
  // 第二个参数不能包含空格
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  // 如果元素的class存在
  if (el.classList) {
    // 返回是否包含指定class
    return el.classList.contains(cls);
  } else {
    // 在className前后加空格，这样所有的样式前后都有空格了，就可以indexOf了
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
}

// 添加class
/* istanbul ignore next */
export function addClass(el: Element, cls: string) {
  // 如果元素不存在，不处理
  if (!el) return;
  // 获取className
  let curClass = el.className;
  // 要添加的样式使用空格分割成数组
  const classes = (cls || '').split(' ');

  // 遍历要添加的class
  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

// 删除节点的Class
/* istanbul ignore next */
export function removeClass(el: Element, cls: string) {
  if (!el || !cls) return;
  const classes = cls.split(' ');
  let curClass = ' ' + el.className + ' ';

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ');
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}
/**
 * Get the left and top offset of the current element
 * left: the distance between the leftmost element and the left side of the document
 * top: the distance from the top of the element to the top of the document
 * right: the distance from the far right of the element to the right of the document
 * bottom: the distance from the bottom of the element to the bottom of the document
 * rightIncludeBody: the distance between the leftmost element and the right side of the document
 * bottomIncludeBody: the distance from the bottom of the element to the bottom of the document
 *
 * 获取当前元素的左偏移量和上偏移量
 * left: 最左边的元素和文档左侧之间的距离
 * top: 从元素顶部到文档顶部的距离
 * right: 从元素最右侧到文档右侧的距离
 * bottom: 从元素底部到文档底部的距离
 * rightIncludeBody: 最左侧元素和文档右侧之间的距离
 * bottomIncludeBody: 从元素底部到文档底部的距离
 * @description:
 */
export function getViewportOffset(element: Element): ViewportOffsetResult {
  const doc = document.documentElement;

  const docScrollLeft = doc.scrollLeft;
  const docScrollTop = doc.scrollTop;
  const docClientLeft = doc.clientLeft;
  const docClientTop = doc.clientTop;

  const pageXOffset = window.pageXOffset;
  const pageYOffset = window.pageYOffset;

  const box = getBoundingClientRect(element);

  const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box as DOMRect;

  const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0);
  const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0);
  const offsetLeft = retLeft + pageXOffset;
  const offsetTop = rectTop + pageYOffset;

  const left = offsetLeft - scrollLeft;
  const top = offsetTop - scrollTop;

  const clientWidth = window.document.documentElement.clientWidth;
  const clientHeight = window.document.documentElement.clientHeight;
  return {
    left: left,
    top: top,
    right: clientWidth - rectWidth - left,
    bottom: clientHeight - rectHeight - top,
    rightIncludeBody: clientWidth - left,
    bottomIncludeBody: clientHeight - top,
  };
}

// 传入一个style属性和一个style值，输出一个对象，包含这种style的各种浏览器前缀
export function hackCss(attr: string, value: string) {
  const prefix: string[] = ['webkit', 'Moz', 'ms', 'OT'];

  const styleObj: any = {};
  prefix.forEach((item) => {
    styleObj[`${item}${upperFirst(attr)}`] = value;
  });
  return {
    ...styleObj,
    [attr]: value,
  };
}

// 给元素设置事件函数
/* istanbul ignore next */
export function on(
  element: Element | HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject
): void {
  if (element && event && handler) {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
    element.addEventListener(event, handler, false);
  }
}

// 移出元素指定事件函数
/* istanbul ignore next */
export function off(
  element: Element | HTMLElement | Document | Window,
  event: string,
  handler: Fn
): void {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false);
  }
}

// 给元素添加一个只执行一次的监听
/* istanbul ignore next */
export function once(el: HTMLElement, event: string, fn: EventListener): void {
  const listener = function (this: any, ...args: unknown[]) {
    if (fn) {
      fn.apply(this, args);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
}


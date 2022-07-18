import type { ComponentRenderProxy, VNode } from 'vue';

// JSX的扩展
// https://www.tslang.cn/docs/handbook/jsx.html
declare global {
  namespace JSX {
    // JSX结果类型
    // 默认地JSX表达式结果的类型为any。
    // 你可以自定义这个类型，通过指定JSX.Element接口。
    // 然而，不能够从接口里检索元素，属性或JSX的子元素的类型信息。 它是一个黑盒。
    // 也就是说JSX返回的是一个VNode
    // tslint:disable no-empty-interface
    type Element = VNode;
    // 因为它必须赋值给JSX.ElementClass或抛出一个错误。 默认的JSX.ElementClass为{}，但是它可以被扩展用来限制JSX的类型以符合相应的接口。
    // 通过类和方法获取JSX组件时，类和方法必须的渲染Kye
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy;
    // ↓ 通过类定义JSX组件时，属性使用'$props'字符串指定属性对象
    interface ElementAttributesProperty {
      $props: any;
    }
    // 配置固有元素
    // 这样就循序JS中任意的标签出现了
    interface IntrinsicElements {
      [elem: string]: any;
    }
    // 配置属性类型
    // 这样，JSX中，就可以写任意的属性了
    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }
}

import { Slots } from 'vue';
import { isFunction } from '/@/utils/is';

/**
 * 从slots中获取指定slot默认是default
 * @description:  Get slot to prevent empty error
 */
export function getSlot(slots: Slots, slot = 'default', data?: any) {
  if (!slots || !Reflect.has(slots, slot)) {
    return null;
  }
  if (!isFunction(slots[slot])) {
    console.error(`${slot} is not a function!`);
    return null;
  }
  const slotFn = slots[slot];
  if (!slotFn) return null;
  return slotFn(data);
}

/**
 * 输出排除指定slot后的slots
 * extends slots
 * @param slots 可以是setup的第二个参数,也可以是render函数的第三个参数,vue渲染组件那一块的
 * @param excludeKeys 要排除的slot
 */
export function extendSlots(slots: Slots, excludeKeys: string[] = []) {
  const slotKeys = Object.keys(slots);
  const ret: any = {};
  slotKeys.map((key) => {
    if (excludeKeys.includes(key)) {
      return null;
    }
    ret[key] = () => getSlot(slots, key);
  });
  return ret;
}


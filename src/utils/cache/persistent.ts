// import type { LockInfo, UserInfo } from '/@/store/types';

import { ProjectConfig } from '/#/config';

import { createLocalStorage, createSessionStorage } from '/@/utils/cache';
import { Memory } from './memory';
import {
  TOKEN_KEY,
  USER_INFO_KEY,
  ROLES_KEY,
  LOCK_INFO_KEY,
  PROJ_CFG_KEY,
  APP_LOCAL_CACHE_KEY,
  APP_SESSION_CACHE_KEY,
} from '/@/enums/cacheEnum';
import { DEFAULT_CACHE_TIME } from '/@/settings/encryptionSetting';
import { toRaw } from 'vue';

// 基础存储接口
interface BasicStore {
  [TOKEN_KEY]: string | number | null | undefined;
  // [USER_INFO_KEY]: UserInfo;
  [USER_INFO_KEY]: any;
  [ROLES_KEY]: string[];
  // [LOCK_INFO_KEY]: LockInfo;
  [LOCK_INFO_KEY]: any;
  [PROJ_CFG_KEY]: ProjectConfig;
}

// LocalStore存储接口
type LocalStore = BasicStore;

// SessionStore存储接口
type SessionStore = BasicStore;

// 基础存储接口的Key
export type BasicKeys = keyof BasicStore;
// LocalStore存储接口Key
type LocalKeys = keyof LocalStore;
// SessionStore存储接口Key
type SessionKeys = keyof SessionStore;

// 创建本地存储
const ls = createLocalStorage();
// 创建Session存储
const ss = createSessionStorage();

// DEFAULT_CACHE_TIME为内存的默认存活时间
// 创建本地内存
const localMemory = new Memory(DEFAULT_CACHE_TIME);
// 创建Session内存
const sessionMemory = new Memory(DEFAULT_CACHE_TIME);

// 初始化持久化内存
function initPersistentMemory() {
  // 获取LocalStorage中的COMMON__LOCAL__KEY__的值
  const localCache = ls.get(APP_LOCAL_CACHE_KEY);
  //获取SessionStorage中的COMMON__SESSION__KEY__的值
  const sessionCache = ss.get(APP_SESSION_CACHE_KEY);
  // 如果存了值，就在内存中也存一份
  localCache && localMemory.resetCache(localCache);
  sessionCache && sessionMemory.resetCache(sessionCache);
}

// 导出一个持久化类，这里面的方法都是静态的
export class Persistent {
  // 获取LocalStorage的内存
  static getLocal<T>(key: LocalKeys) {
    return localMemory.get(key)?.value as Nullable<T>;
  }

  // 设置LocalStorage的内存
  static setLocal(key: LocalKeys, value: LocalStore[LocalKeys], immediate = false): void {
    localMemory.set(key, toRaw(value));
    immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
  }

  // 移出LocalStorage的内存
  static removeLocal(key: LocalKeys): void {
    localMemory.remove(key);
  }

  // 清除LocalStorage的内存
  static clearLocal(): void {
    localMemory.clear();
  }

  // 获取SessionStorage的内存
  static getSession<T>(key: SessionKeys) {
    return sessionMemory.get(key)?.value as Nullable<T>;
  }

  // 设置SessionStorage的内存
  static setSession(key: SessionKeys, value: SessionStore[SessionKeys], immediate = false): void {
    sessionMemory.set(key, toRaw(value));
    immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory);
  }

  // 移出SessionStorage的内存
  static removeSession(key: SessionKeys): void {
    sessionMemory.remove(key);
  }

  // 清除SessionStorage的内存
  static clearSession(): void {
    sessionMemory.clear();
  }

  // 将两种内存都清除
  static clearAll() {
    sessionMemory.clear();
    localMemory.clear();
  }
}

// 当窗口刷新或者关闭窗口
window.addEventListener('beforeunload', function () {
  // 将内存加载到LocalStorage
  ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
  // 将内存加载到SessionStorage
  ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache);
});

// 当存储库修改时
function storageChange(e: any) {
  const { key, newValue, oldValue } = e;

  if (!key) {
    Persistent.clearAll();
    return;
  }

  if (!!newValue && !!oldValue) {
    if (APP_LOCAL_CACHE_KEY === key) {
      Persistent.clearLocal();
    }
    if (APP_SESSION_CACHE_KEY === key) {
      Persistent.clearSession();
    }
  }
}

// https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
// https://zhuanlan.zhihu.com/p/70497745
// 只监听LocalStorage的变化
// 监听其他窗口是否改变了LocalStorage，当前窗口修改的不处理
window.addEventListener('storage', storageChange);

// 将LocalStorage和SessionStorage加载到内存中
initPersistentMemory();
// console.log('初始化localMemory', localMemory);
// console.log('初始化sessionMemory', sessionMemory);


import { cacheCipher } from '/@/settings/encryptionSetting';

import type { EncryptionParams } from '/@/utils/cipher';

import { AesEncryption } from '/@/utils/cipher';

import { isNullOrUnDef } from '/@/utils/is';

// 创建缓存的参数
export interface CreateStorageParams extends EncryptionParams {
  prefixKey: string;
  storage: Storage;
  hasEncrypt: boolean;
  timeout?: Nullable<number>;
}

// 创建一个存储库
// Partial将类型的所有属性变成可选的
export const createStorage = ({
  prefixKey = '',
  storage = sessionStorage,
  key = cacheCipher.key,
  iv = cacheCipher.iv,
  timeout = null,
  hasEncrypt = true,
}: Partial<CreateStorageParams> = {}) => {
  // 如果需要加密，加密key和偏移量需要为16bit
  if (hasEncrypt && [key.length, iv.length].some((item) => item !== 16)) {
    throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!');
  }

  // 使用Aes对称加密
  const encryption = new AesEncryption({ key, iv });

  /**
   *Cache class
   *Construction parameters can be passed into sessionStorage, localStorage,
   * @class Cache
   * @example
   */
  const WebStorage = class WebStorage {
    // 存储库
    private storage: Storage;
    // 前缀Key
    private prefixKey?: string;
    // 加密器
    private encryption: AesEncryption;
    // 是否需要加密
    private hasEncrypt: boolean;
    /**
     *
     * @param {*} storage
     */
    constructor() {
      this.storage = storage;
      this.prefixKey = prefixKey;
      this.encryption = encryption;
      this.hasEncrypt = hasEncrypt;
    }

    private getKey(key: string) {
      // 前缀 + 参数变大写
      return `${this.prefixKey}${key}`.toUpperCase();
    }

    /**
     *
     *  Set cache
     * @param {string} key
     * @param {*} value
     * @expire Expiration time in seconds
     * @memberof Cache
     */
    // 设置一个值
    set(key: string, value: any, expire: number | null = timeout) {
      const stringData = JSON.stringify({
        value,
        time: Date.now(),
        expire: !isNullOrUnDef(expire) ? new Date().getTime() + expire * 1000 : null,
      });
      // 最终存储的字符串，判断需不需要加密
      const stringifyValue = this.hasEncrypt
        ? this.encryption.encryptByAES(stringData)
        : stringData;
      // storage设置Key，Value
      this.storage.setItem(this.getKey(key), stringifyValue);
    }

    /**
     *Read cache
     * @param {string} key
     * @memberof Cache
     */
    get(key: string, def: any = null): any {
      const val = this.storage.getItem(this.getKey(key));
      if (!val) return def;

      try {
        // 如果有加密，就解密
        const decVal = this.hasEncrypt ? this.encryption.decryptByAES(val) : val;
        // 获取解密对象
        const data = JSON.parse(decVal);
        // 查看是否过期
        const { value, expire } = data;
        if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
          return value;
        }
        // 如果过期，删除Key，但是这里没有返回了。
        this.remove(key);
      } catch (e) {
        return def;
      }
    }

    /**
     * Delete cache based on key
     * @param {string} key
     * @memberof Cache
     */
    remove(key: string) {
      this.storage.removeItem(this.getKey(key));
    }

    /**
     * Delete all caches of this instance
     * 删除所有缓存
     */
    clear(): void {
      this.storage.clear();
    }
  };
  return new WebStorage();
};


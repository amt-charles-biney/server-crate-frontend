import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  cache = new Map<string, any>();
  keysToCache = [
    '/admin/product',
    '/admin/attributes',
    '/admin/category/config',
    '/admin/cases',
    '/profile/basic-info',
    '/profile/shipping-info',
  ];
  constructor() {}

  addToCache(url: string, data: any) {
    if (this.shouldCache(url)) {
      this.cache.set(url, data);
    }
  }

  removeFromCache(url: string) {
    const keyToFind = this.keysToCache.find((value) => url.includes(value))
    if (keyToFind) {            
      Array.from(this.cache.keys()).forEach((key) => {
        if (url.includes(keyToFind) && key.includes(keyToFind)) {
            this.cache.delete(key);
        }
      })
    }
  }

  removeKeyFromCache(key: string | string[]) {
    if (typeof key === 'string') {
      Array.from(this.cache.keys()).forEach((cacheKey) => {
        if (cacheKey.includes(key)) {
            this.cache.delete(cacheKey);
        }
      })
    } else {
      key.forEach((k) => {
        Array.from(this.cache.keys()).forEach((cacheKey) => {
          if (cacheKey.includes(k)) {
              this.cache.delete(cacheKey);
          }
        })
      })
    }
  }

  shouldCache(url: string): boolean {
    return this.keysToCache.some((key) => url.includes(key));
  }
}

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

  shouldCache(url: string): boolean {
    return this.keysToCache.some((key) => url.includes(key));
  }
}

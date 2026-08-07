import { Injectable } from '@angular/core';
import { Observable, shareReplay, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, Observable<any>>();
  // Default TTL: 5 minutes (in milliseconds)
  private readonly DEFAULT_TTL = 5 * 60 * 1000;

  /**
   * Wraps an Observable with a replay cache keyed by `key`.
   * The same Observable is returned for all callers until TTL expires or invalidate() is called.
   */
  get<T>(key: string, factory: () => Observable<T>, ttlMs = this.DEFAULT_TTL): Observable<T> {
    if (!this.cache.has(key)) {
      const cached$ = factory().pipe(
        shareReplay({ bufferSize: 1, refCount: false })
      );
      this.cache.set(key, cached$);

      // Auto-expire the cache entry after TTL
      timer(ttlMs).subscribe(() => this.cache.delete(key));
    }
    return this.cache.get(key) as Observable<T>;
  }

  /** Manually bust a specific cache entry (e.g. after a write operation) */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /** Bust all entries with keys starting with prefix (e.g. 'products') */
  invalidatePrefix(prefix: string): void {
    this.cache.forEach((_, key) => {
      if (key.startsWith(prefix)) this.cache.delete(key);
    });
  }

  /** Clear everything */
  clear(): void {
    this.cache.clear();
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { CacheService } from './cache.service';

export interface CompanySettings {
  companyName: string;
  shortName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  footerNote: string;
  motto: string;
  logoUrl: string;
  printerType: 'normal' | 'thermal'; // normal = A4/Letter, thermal = POS/receipt printer
}

const DEFAULT_SETTINGS: CompanySettings = {
  companyName: 'SMATO MANUFACTURING LIMITED',
  shortName: 'Smato',
  tagline: 'Manufacturing Ltd',
  address: 'Plot 1-6 Abudaka,Gambari, Ogbomoso',
  phone: '08081303202, 08167626228',
  email: 'Smatomanufacturing@yahoo.com',
  footerNote:
    'Customers are advised to cross check their goods properly before leaving. No refund of money after payment. Thanks.',
  motto: 'JESUS IS THE LORD',
  logoUrl: '../../assets/smatologo-removebg-preview.png',
  printerType: 'normal',
};

@Injectable({
  providedIn: 'root',
})
export class CompanySettingsService {
  private readonly cacheKey = 'settings:company';

  /**
   * Single source of truth for company settings across the whole app.
   * Seeded with DEFAULT_SETTINGS so components never render blank before
   * the HTTP response arrives. Updated by loadSettings() and updateSettings().
   */
  private readonly settingsSubject = new BehaviorSubject<CompanySettings>(DEFAULT_SETTINGS);

  /** Reactive stream — subscribe to this in components to auto-update when settings change. */
  readonly settings$ = this.settingsSubject.asObservable();

  constructor(private http: HttpClient, private cache: CacheService) {}

  /**
   * Fetch settings from the API (cached for 5 min). Pushes the result into
   * the BehaviorSubject so all subscribers update automatically.
   */
  loadSettings(): Observable<{ status: boolean; settings: CompanySettings }> {
    return this.cache
      .get(this.cacheKey, () =>
        this.http.get<{ status: boolean; settings: CompanySettings }>(
          `${environment.baseUrl}/settings/company`
        )
      )
      .pipe(
        tap((res) => {
          if (res?.settings) {
            this.settingsSubject.next(res.settings);
          }
        })
      );
  }

  /**
   * Synchronous snapshot — useful for property initializers in components
   * so the view never flashes empty while the HTTP call is in-flight.
   */
  getSettingsSnapshot(): CompanySettings {
    return this.settingsSubject.value;
  }

  /**
   * Persist new settings to the API, invalidate the cache, and immediately
   * push the updated values into the BehaviorSubject so every subscriber
   * (sidebar, navbar, receipts, etc.) reflects the change without a page reload.
   */
  updateSettings(
    settings: CompanySettings
  ): Observable<{ status: boolean; message: string; settings: CompanySettings }> {
    return this.http
      .put<{ status: boolean; message: string; settings: CompanySettings }>(
        `${environment.baseUrl}/settings/company`,
        settings
      )
      .pipe(
        tap((res) => {
          if (res?.settings) {
            this.cache.invalidate(this.cacheKey);
            // Push immediately — all subscribers (shell, navbar, login branding, etc.)
            // update in real-time without a page reload.
            this.settingsSubject.next(res.settings);
          }
        })
      );
  }
}

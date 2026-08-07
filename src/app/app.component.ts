import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanySettingsService } from './services/company-settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = this.companySettingsService.getSettingsSnapshot().companyName;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private companySettingsService: CompanySettingsService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    // Subscribe to settings$ so the browser tab title automatically reflects
    // whatever company name is saved in the database — including after admin updates.
    this.companySettingsService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe((settings) => {
        if (settings?.companyName) {
          this.title = settings.companyName;
          this.titleService.setTitle(settings.companyName);
        }
      });

    // Kick off the initial fetch (AppComponent loads first, so all child components
    // benefit from the cached result via the BehaviorSubject).
    this.companySettingsService.loadSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

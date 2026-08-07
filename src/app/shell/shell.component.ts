import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserServiceService } from '../services/user-service.service';
import {
  CompanySettings,
  CompanySettingsService,
} from '../services/company-settings.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
})
export class ShellComponent implements OnInit, OnDestroy {
  currentUserName = '';
  currentUserRole = '';
  isCollapsed = false;
  mobileOpen = false;
  companySettings: CompanySettings = this.companySettingsService.getSettingsSnapshot();

  private readonly COLLAPSE_KEY = 'smato_sidebar_collapsed';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private userService: UserServiceService,
    private router: Router,
    private companySettingsService: CompanySettingsService
  ) {}

  ngOnInit(): void {
    this.isCollapsed = localStorage.getItem(this.COLLAPSE_KEY) === 'true';

    // Subscribe to the reactive settings stream — sidebar/navbar update the instant
    // admin saves new company info, no page reload needed.
    this.companySettingsService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe((settings) => {
        this.companySettings = settings;
      });

    // Trigger the initial load (populates cache + emits to settings$)
    this.companySettingsService.loadSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    const email = sessionStorage.getItem('smato_email');
    if (email) {
      this.userService.GetCurrentUser(email).subscribe((res: any) => {
        if (res?.currentUser) {
          this.currentUserName = res.currentUser.fname;
          this.currentUserRole = res.currentUser.role;
        }
      });
    }

    // Close mobile sidebar on any navigation
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe(() => this.closeMobile());
      console.log();
      
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Desktop: collapse sidebar to icon-only */
  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem(this.COLLAPSE_KEY, String(this.isCollapsed));
  }

  /** Mobile: slide sidebar in */
  openMobile(): void {
    this.mobileOpen = true;
    document.body.style.overflow = 'hidden';
  }

  /** Mobile: slide sidebar out */
  closeMobile(): void {
    this.mobileOpen = false;
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.closeMobile();
  }

  logOut(): void {
    this.closeMobile();
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem(this.COLLAPSE_KEY);
    sessionStorage.removeItem('smato_email');
    this.router.navigate(['']);
  }
}

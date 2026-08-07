import { Component, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserServiceService } from '../services/user-service.service';
import {
  CompanySettings,
  CompanySettingsService,
} from '../services/company-settings.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Input() name: any;

  currentUserEmail: any;
  currentUserDetails: any;
  isCollapsed = false;
  mobileOpen = false;
  companySettings: CompanySettings = this.companySettingsService.getSettingsSnapshot();

  private readonly COLLAPSE_KEY = 'smato_sidebar_collapsed';
  private readonly destroy$ = new Subject<void>();

  constructor(
    public router: Router,
    public _userService: UserServiceService,
    private companySettingsService: CompanySettingsService
  ) {}

  ngOnInit(): void {
    this.isCollapsed = localStorage.getItem(this.COLLAPSE_KEY) === 'true';

    // Subscribe to the reactive stream so the sidenav brand always shows
    // the live company name and tagline from the database.
    this.companySettingsService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe((settings) => {
        this.companySettings = settings;
      });

    this.companySettingsService.loadSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.currentUserEmail = sessionStorage.getItem('smato_email');
    if (this.currentUserEmail) {
      this._userService.GetCurrentUser(this.currentUserEmail).subscribe((res: any) => {
        this.currentUserDetails = res?.currentUser;
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem(this.COLLAPSE_KEY, String(this.isCollapsed));
  }

  openMobile(): void {
    this.mobileOpen = true;
  }

  closeMobile(): void {
    this.mobileOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.mobileOpen = false;
  }

  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem(this.COLLAPSE_KEY);
    sessionStorage.removeItem('smato_email');
    this.router.navigate(['']);
  }
}

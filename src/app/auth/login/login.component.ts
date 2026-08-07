import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserServiceService } from 'src/app/services/user-service.service';
import {
  CompanySettings,
  CompanySettingsService,
} from 'src/app/services/company-settings.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  signinForm!: FormGroup;
  loading = false;
  errorMessage?: string;
  hide = true;
  companySettings: CompanySettings = this.companySettingsService.getSettingsSnapshot();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private _userservice: UserServiceService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private companySettingsService: CompanySettingsService
  ) {}

  ngOnInit(): void {
    // Subscribe to the reactive stream so the branding panel always shows
    // the latest company name / tagline from the database.
    this.companySettingsService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe((settings) => {
        this.companySettings = settings;
      });

    // Trigger load (uses cache if already fetched by AppComponent)
    this.companySettingsService.loadSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(form: FormGroup): void {
    this.loading = true;
    this.errorMessage = undefined;

    this._userservice.Login(form.value).subscribe(
      (item: any) => {
        this.loading = false;
        sessionStorage.setItem('smato_email', form.value.email);
        this._snackBar.open('Login Successful', 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['green-snackbar', 'login-snackbar'],
        });
        this.router.navigate(['/dashboard']);
      },
      (errorResponse: any) => {
        this.loading = false;
        this.errorMessage = errorResponse?.error?.message;
        const msg = this.errorMessage || 'Please check your internet connection';
        this._snackBar.open(msg, 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['red-snackbar', 'login-snackbar'],
        });
      }
    );
  }
}

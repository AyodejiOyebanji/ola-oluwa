import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserServiceService } from 'src/app/services/user-service.service';
import {
  CompanySettings,
  CompanySettingsService,
} from 'src/app/services/company-settings.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  hide = true;
  signupForm!: FormGroup;
  loading = false;
  errorMessage?: string;
  companySettings: CompanySettings = this.companySettingsService.getSettingsSnapshot();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private _snackBar: MatSnackBar,
    public _userService: UserServiceService,
    private companySettingsService: CompanySettingsService
  ) {}

  ngOnInit(): void {
    // Subscribe to the reactive stream — company name on sign-up page always
    // reflects the latest value from the database.
    this.companySettingsService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe((settings) => {
        this.companySettings = settings;
      });

    this.companySettingsService.loadSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.signupForm = this.fb.group({
      fname: ['', [Validators.required, Validators.minLength(2)]],
      lname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      role: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        ],
      ],
      bankname: [''],
      acct_no: [''],
      acct_name: [''],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit(form: FormGroup): void {
    if (form.invalid) return;
    this.loading = true;

    this._userService.Register(form.value).subscribe(
      (item: any) => {
        this.loading = false;
        sessionStorage.setItem('smato_email', form.value.email);
        this._snackBar.open('Registration Successful!', 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['green-snackbar', 'login-snackbar'],
        });
        this.router.navigate(['confirm-email']);
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

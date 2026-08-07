import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  CompanySettings,
  CompanySettingsService,
} from '../services/company-settings.service';

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.css'],
})
export class CompanySettingsComponent implements OnInit, OnDestroy {
  /** Current state shown in the read-only preview */
  settings: CompanySettings = this.companySettingsService.getSettingsSnapshot();
  /** Working copy bound to the form while editing */
  draft: CompanySettings = { ...this.settings };

  editing = false;
  saving = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private companySettingsService: CompanySettingsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Subscribe to the live stream so this page always reflects whatever
    // is in the database — including updates made from another tab.
    this.companySettingsService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe((s) => {
        this.settings = s;
        if (!this.editing) {
          this.draft = { ...s };
        }
      });

    this.companySettingsService.loadSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startEdit(): void {
    this.draft = { ...this.settings };
    this.editing = true;
  }

  cancelEdit(): void {
    this.draft = { ...this.settings };
    this.editing = false;
  }

  save(): void {
    this.saving = true;

    this.companySettingsService.updateSettings(this.draft).subscribe({
      next: (res) => {
        this.saving = false;
        this.editing = false;
        // settings$ subscriber above will update this.settings automatically
        this.snackBar.open('Company settings saved successfully', 'OK', {
          duration: 3500,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['green-snackbar'],
        });
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(
          err?.error?.message || 'Failed to save — please try again',
          'OK',
          {
            duration: 4000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['red-snackbar'],
          }
        );
      },
    });
  }
}

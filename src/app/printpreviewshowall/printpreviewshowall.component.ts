import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserServiceService } from '../services/user-service.service';
import * as numberToWords from 'number-to-words';
import {
  CompanySettings,
  CompanySettingsService,
} from '../services/company-settings.service';

@Component({
  selector: 'app-printpreviewshowall',
  templateUrl: './printpreviewshowall.component.html',
  styleUrls: ['./printpreviewshowall.component.css'],
})
export class PrintpreviewshowallComponent implements OnInit, OnDestroy {
  public getReceiptId: any;
  public receiptDetails: any;
  public amountInWords: any;
  public allReceipt: any;
  public companySettings: CompanySettings = this.companySettingsService.getSettingsSnapshot();

  private readonly destroy$ = new Subject<void>();

  constructor(
    public _userService: UserServiceService,
    public router: Router,
    private act_route: ActivatedRoute,
    private companySettingsService: CompanySettingsService
  ) {}

  ngOnInit(): void {
    // Subscribe to the reactive stream — printed receipts always show the
    // latest company identity from the database.
    this.companySettingsService.settings$
      .pipe(takeUntil(this.destroy$))
      .subscribe((settings) => {
        this.companySettings = settings;
      });

    this.companySettingsService.loadSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe();

    this.act_route.paramMap.subscribe((params) => {
      this.getReceiptId = params.get('id');
    });

    this._userService.getPrintDetails(this.getReceiptId).subscribe((res: any) => {
      this.receiptDetails = res.currentReceipt;
      this.amountInWords = numberToWords.toWords(this.receiptDetails?.totalAmount);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  printReceipt(): void {
    // If thermal printer, add body class to trigger special @page sizing
    // This avoids paper waste — only prints exactly what's needed
    if (this.companySettings.printerType === 'thermal') {
      document.body.classList.add('printing-thermal');
    }

    // Trigger browser print
    window.print();

    // Clean up body class after print dialog closes
    // (works on most browsers — some may need a slight delay)
    setTimeout(() => {
      document.body.classList.remove('printing-thermal');
    }, 100);
  }
}

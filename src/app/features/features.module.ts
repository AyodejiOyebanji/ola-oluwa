import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { ShellComponent } from '../shell/shell.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProductsComponent } from '../products/products.component';
import { ReceiptComponent } from '../receipt/receipt.component';
import { PrintpreviewComponent } from '../printpreview/printpreview.component';
import { AllReceiptComponent } from '../all-receipt/all-receipt.component';
import { PermissionComponent } from '../permission/permission.component';
import { AmountinwordpipePipe } from '../pipe/amountinwordpipe.pipe';
import { TransformfirstletterPipe } from '../pipe/transformfirstletter.pipe';
import { NewStaffComponent } from '../new-staff/new-staff.component';
import { ProfileComponent } from '../profile/profile.component';
import { PrintpreviewshowallComponent } from '../printpreviewshowall/printpreviewshowall.component';
import { ShowAllreceiptComponent } from '../show-allreceipt/show-allreceipt.component';
import { HistoryComponent } from '../history/history.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { InventoryComponent } from '../inventory/inventory.component';
import { SetupComponent } from '../setup/setup.component';
import { BankComponent } from '../bank/bank.component';
import { AccountTypeComponent } from '../account-type/account-type.component';
import { ChartofaccountComponent } from '../chartofaccount/chartofaccount.component';
import { ReceivablesComponent } from '../receivables/receivables.component';
import { ReceivableComponent } from '../receivable/receivable.component';
import { WalletComponent } from '../wallets/wallets.component';
import { WalletEachComponent } from '../wallet-each/wallet-each.component';
import { NewVoucherComponent } from '../new-voucher/new-voucher.component';
import { VoucherSetUpComponent } from '../voucher-set-up/voucher-set-up.component';
import { VouchersComponent } from '../vouchers/vouchers.component';
import { ViewVoucherComponent } from '../view-voucher/view-voucher.component';
import { PayrollComponent } from '../payroll/payroll.component';
import { PayrollsComponent } from '../payrolls/payrolls.component';
import { PayrollSetupComponent } from '../payroll-setup/payroll-setup.component';
import { ViewPayrollComponent } from '../view-payroll/view-payroll.component';
import { NewMaterialVoucherComponent } from '../new-material-voucher/new-material-voucher.component';
import { RawmateriallistsComponent } from '../rawmateriallists/rawmateriallists.component';
import { ViewRawmaterialvoucherComponent } from '../view-rawmaterialvoucher/view-rawmaterialvoucher.component';
import { PaymentlogsComponent } from '../paymentlogs/paymentlogs.component';
import { StatementComponent } from '../statement/statement.component';
import { ViewStatementComponent } from '../view-statement/view-statement.component';
import { HistorySetupComponent } from '../history-setup/history-setup.component';
import { AddreceiptpaymentComponent } from '../addreceiptpayment/addreceiptpayment.component';
import { CompanySettingsComponent } from '../company-settings/company-settings.component';

/**
 * All authenticated pages are children of ShellComponent.
 * The Shell renders the sidebar + navbar once via <router-outlet>.
 * Individual page components contain ONLY their own page content.
 */
const routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: 'dashboard',           component: DashboardComponent,              title: 'Dashboard' },
      { path: 'products',            component: ProductsComponent,               title: 'Products' },
      { path: 'receipt',             component: ReceiptComponent,                title: 'Receipt' },
      { path: 'preview/:id',         component: PrintpreviewComponent,           title: 'Preview' },
      { path: 'previewshowall/:id',  component: PrintpreviewshowallComponent,    title: 'Preview' },
      { path: 'allreceipt',          component: ShowAllreceiptComponent,         title: 'All Receipts' },
      { path: 'permission',          component: PermissionComponent,             title: 'Permission' },
      { path: 'new-staff',           component: NewStaffComponent,               title: 'New Staff' },
      { path: 'profile',             component: ProfileComponent,                title: 'Profile' },
      { path: 'history',             component: HistoryComponent,                title: 'History' },
      { path: 'stats',               component: StatisticsComponent,             title: 'Statistics' },
      { path: 'inventory',           component: InventoryComponent,              title: 'Inventory' },
      { path: 'set-up',              component: SetupComponent,                  title: 'Set Up' },
      { path: 'account-type',        component: AccountTypeComponent,            title: 'Account Type' },
      { path: 'receivables',         component: ReceivablesComponent,            title: 'Receivables' },
      { path: 'receivable/:id',      component: ReceivableComponent,             title: 'Receivable' },
      { path: 'wallets',             component: WalletComponent,                 title: 'Wallets' },
      { path: 'wallet/:id',          component: WalletEachComponent,             title: 'Wallet' },
      { path: 'voucher-set-up',      component: VoucherSetUpComponent,           title: 'Voucher Set Up' },
      { path: 'view-voucher/:id',    component: ViewVoucherComponent,            title: 'Voucher' },
      { path: 'payroll-setup',       component: PayrollSetupComponent,           title: 'Payroll' },
      { path: 'payrolls',            component: PayrollsComponent,               title: 'Payrolls' },
      { path: 'view-payroll/:id',    component: ViewPayrollComponent,            title: 'View Payroll' },
      { path: 'view-material/:id',   component: ViewRawmaterialvoucherComponent, title: 'Raw Material' },
      { path: 'statement',           component: StatementComponent,              title: 'Statement' },
      { path: 'view-statement/:id',  component: ViewStatementComponent,          title: 'View Statement' },
      { path: 'history-setup',       component: HistorySetupComponent,           title: 'History Setup' },
      { path: 'company-settings',    component: CompanySettingsComponent,        title: 'Company Settings' },
    ],
  },
];

@NgModule({
  declarations: [
    ShellComponent,
    DashboardComponent,
    ProductsComponent,
    ReceiptComponent,
    PrintpreviewComponent,
    AllReceiptComponent,
    PermissionComponent,
    AmountinwordpipePipe,
    TransformfirstletterPipe,
    NewStaffComponent,
    ProfileComponent,
    PrintpreviewshowallComponent,
    ShowAllreceiptComponent,
    HistoryComponent,
    StatisticsComponent,
    InventoryComponent,
    SetupComponent,
    BankComponent,
    AccountTypeComponent,
    ChartofaccountComponent,
    ReceivablesComponent,
    ReceivableComponent,
    WalletComponent,
    WalletEachComponent,
    NewVoucherComponent,
    VoucherSetUpComponent,
    VouchersComponent,
    ViewVoucherComponent,
    PayrollComponent,
    PayrollsComponent,
    PayrollSetupComponent,
    ViewPayrollComponent,
    NewMaterialVoucherComponent,
    RawmateriallistsComponent,
    ViewRawmaterialvoucherComponent,
    PaymentlogsComponent,
    StatementComponent,
    ViewStatementComponent,
    HistorySetupComponent,
    AddreceiptpaymentComponent,
    CompanySettingsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    MatIconModule,
    MatStepperModule,
    MatExpansionModule,
    MatMenuModule,
    MatDatepickerModule,
  ],
  providers: [DatePipe],
})
export class FeaturesModule {}

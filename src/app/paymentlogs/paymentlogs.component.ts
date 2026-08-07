import { Component } from '@angular/core';
import { PaymentlogsService } from '../services/paymentlogs.service';
import { DatePipe } from '@angular/common';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-paymentlogs',
  templateUrl: './paymentlogs.component.html',
  styleUrls: ['./paymentlogs.component.css']
})
export class PaymentlogsComponent {
  public filteredPaymentlogs: any[] = [];
  public paymentlogs:any
  public searchQuery = '';
  public currentUserEmail: any;
  public currentUserDetails: any;
  public summary:any

  constructor(
    public  paymentlogsService:PaymentlogsService,
    public _userService: UserServiceService,
  ) {}
    ngOnInit() {
      this.fetchPaymentLogs()
      this.currentUserEmail = sessionStorage.getItem('smato_email');
      this._userService
      .GetCurrentUser(this.currentUserEmail)
      .subscribe((res: any) => {
        this.currentUserDetails = res.currentUser;
    
        
  
        
    
        
      });
      this.fetchSummaryforCreditAndDebit()
    }
    fetchPaymentLogs(){
      this.paymentlogsService.fetchPaymentLogs().subscribe((res:any)=>{
  
        if(res.status==true){
          this.paymentlogs=res.paymentlogs
          this.filteredPaymentlogs= [...this.paymentlogs]
        }else{

        }
        
      })
    }
    search() {
      if (this.searchQuery) {
        this.filteredPaymentlogs = this.paymentlogs.filter((payment: any) =>
          this.matchesSearchQuery(payment)
        );
      } else {
        this.filteredPaymentlogs = [...this.paymentlogs];
      }
    }
    
    matchesSearchQuery(payment: any): boolean {
      const query = this.searchQuery.toLowerCase();
    
      return (
        payment.transaction_type?.toLowerCase().includes(query) ||
        payment.description?.toString().toLowerCase().includes(query) ||
        payment.amount?.toString().includes(query) ||
        payment.createdAt?.toString().includes(query) ||
        // Guard the full chain — accountData may be null/undefined
        payment?.accountData?.title?.toLowerCase().includes(query)
      );
    }
    getDescriptionWord(description: string): string {
      // Split the description by spaces and get the first word
      const words = description.split(' ');
      if (words.length > 0) {
        return words[0].trim();
      } else {
        return ''; // Return an empty string if the description is empty
      }
    }
    formatDate(inputDate: string | Date): string {
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(inputDate, 'yyyy-MM-dd');
      return formattedDate || ''; 
    }
    fetchSummaryforCreditAndDebit(){
      this.paymentlogsService.fetchSummaryforCreditAndDebit().subscribe((res:any)=>{
      
        this.summary=res
        
      })
    }

}

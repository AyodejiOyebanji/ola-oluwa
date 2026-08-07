import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { ChartofaccountService } from '../services/chartofaccount.service';

@Component({
  selector: 'app-view-statement',
  templateUrl: './view-statement.component.html',
  styleUrls: ['./view-statement.component.css'],
})
export class ViewStatementComponent {
  public currentUserEmail: any;
  public currentUserDetails: any;
  public getAccountId: any;
  public accountDetails:any
  constructor(
    public router: Router,
    private act_route: ActivatedRoute,

    private _snackBar: MatSnackBar,
    public _userService: UserServiceService,
    private chartOfAccountService: ChartofaccountService
  ) {}

  ngOnInit() {
    this.act_route.paramMap.subscribe((params) => {
      this.getAccountId = params.get('id');
    });
    this.currentUserEmail = sessionStorage.getItem('smato_email');
    this._userService
      .GetCurrentUser(this.currentUserEmail)
      .subscribe((res: any) => {
        this.currentUserDetails = res.currentUser;
      });
      this.fetchAccountStatement()


  }

  fetchAccountStatement(){
  this.chartOfAccountService.fetchAccountStatement(this.getAccountId).subscribe((res:any)=>{
 
    if (res.status==true) {
      this.accountDetails= res
      
    }
    
  })
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
}

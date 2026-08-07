import { Component } from '@angular/core';
import { ActtypeService } from '../services/acttype.service';

@Component({
  selector: 'app-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.css']
})
export class AccountTypeComponent {
  public act_id:any
  public title:any
  public description:any


  ngOnInit(){

  }
  constructor(
    
    private account_typeserice:ActtypeService
  
  ) {}
  add(){
    let acct_typeObj={
      act_id:this.act_id,
      title: this.title,
      description:this.description
    }

    this.account_typeserice.addActType(acct_typeObj).subscribe((item:any)=>{
    
      
    })

  }
}

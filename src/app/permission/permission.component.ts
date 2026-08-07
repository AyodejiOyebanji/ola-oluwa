import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent {
  constructor(
   private router:Router
  ) {}

  newStaff(){
    this.router.navigate(["new-staff"])
  }
}

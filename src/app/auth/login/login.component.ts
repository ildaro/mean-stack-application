import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  templateUrl:'./login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent{
  isLoading = false;

  constructor(public authService: AuthService) {}

  onLogin(form: NgForm){
    if(form.invalid){//if not valid email/password then returns
      return;
    }
    this.authService.login(form.value.email, form.value.password);
  }
}

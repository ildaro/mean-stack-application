import { registerLocaleData } from "@angular/common";
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  templateUrl:'./signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent{
  isLoading = false;

  constructor(public authService: AuthService) {} //inject AuthService

  onSignUp(form: NgForm){
    //if no valid email/password then return
    if(form.invalid){
      return;
    }
    this.authService.createUser(form.value.email, form.value.password);
  }
}

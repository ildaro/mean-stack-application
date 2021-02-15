import { registerLocaleData } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl:'./signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy{
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService,) {} //inject AuthService

  ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignUp(form: NgForm){
    //if no valid email/password then return
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password)
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}

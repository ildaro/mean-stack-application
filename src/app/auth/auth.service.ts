import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    return this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post<{ token: string, expiresIn: number, userId: string }>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token; //get token from the response
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true); //to know if the user is authorized using authStatusListener
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000) // expiration date for token is current time + 1hr
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']); //redirect to homepage after logging in
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  //automatically authenticate user if token exist in local storage
  autoAuthUser(){
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    //if the token has not expired yet then the user is authenticated and the timer is set
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn/1000);
      this.authStatusListener.next(true);

    }
  }

  //logs user out by clearing token and informing any components subscribed
  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']); //redirect to homepage after logging out
  }

  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  //store token and expirationDate in local storage on the browser
  private saveAuthData(token: string, expirationDate: Date, userId: string){
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  //clear local storage
  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate){
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}

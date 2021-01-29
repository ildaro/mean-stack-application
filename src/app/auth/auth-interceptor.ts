import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable() //need this annotation so we can inject services into this service
//using HttpInterceptor to add token to request going to the backend
export class AuthInterceptor implements HttpInterceptor{
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    const authRequest = req.clone({ //clone request before manipulating is good practice
      headers: req.headers.set("Authorization", "Bearer " + authToken) //add a new header to the headers
    });
    return next.handle(authRequest);
  }
}

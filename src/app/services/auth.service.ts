import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AlertType } from "./../enums/alert-type.enum";
import { Alert } from "./../classes/alert";
import { AlertService } from "./alert.service";
import { of } from "rxjs";
import { Observable } from "rxjs";
import { User } from "../classes/user";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  currentUser: Observable<User | null>;

  constructor(private router: Router, private alertService: AlertService) {
    this.currentUser = of(null);
  }

  signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Observable<boolean> {
    return of(true);
  }

  login(email: string, password: string): Observable<boolean> {
    return of(true);
  }

  logout(): void {
    this.router.navigate(["/login"]);
    this.alertService.alerts.next(new Alert("You have been sign out"));
  }
}

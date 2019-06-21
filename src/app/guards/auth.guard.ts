import { AuthService } from "./../services/auth.service";
import { AlertService } from "./../services/alert.service";
import { AlertType } from "./../enums/alert-type.enum";
import { Alert } from "./../classes/alert";
import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { Observable } from "rxjs";
import { map, take, tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.currentUser.pipe(
      take(1),
      map(currentUser => !!currentUser),
      tap(loggedIn => {
        if (loggedIn) {
          console.log("Logged in");
        }
        if (!loggedIn) {
          this.alertService.alerts.next(
            new Alert(
              "You must be logged in to access this page.",
              AlertType.Danger
            )
          );
          console.log("Not logged in");
          this.router.navigate(["/login"], {
            queryParams: { returnUrl: state.url }
          });
        }
      })
    );
  }
}

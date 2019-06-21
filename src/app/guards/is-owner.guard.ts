import { AlertType } from "./../enums/alert-type.enum";
import { Alert } from "./../classes/alert";
import { AlertService } from "src/app/services/alert.service";
import { AuthService } from "./../services/auth.service";
import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { map, take, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class IsOwnerGuard implements CanActivate {
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
      map(
        currentUser => !!currentUser && currentUser.id === next.params.userId
      ),
      tap(isOwner => {
        if (!isOwner) {
          this.alertService.alerts.next(
            new Alert("You can only edit your profile", AlertType.Danger)
          );
          this.router.navigate(["/login"], {
            queryParams: { returnUrl: state.url }
          });
        }
      })
    );
  }
}

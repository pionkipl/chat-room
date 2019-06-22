import { AuthService } from "./../../services/auth.service";
import { Subscription } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertType } from "src/app/enums/alert-type.enum";
import { Alert } from "./../../classes/alert";
import { AlertService } from "./../../services/alert.service";
import { LoadingService } from "src/app/services/loading.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  submitted = false;
  private subscriptions: Array<Subscription> = [];
  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams["/returnUrl"] || "/chat";

    this.subscriptions.push(
      this.authService.currentUser.subscribe(user => {
        if (!!user) {
          this.router.navigateByUrl("/chat");
        }
      })
    );
  }

  submit(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.loadingService.isLoading.next(true);
      const { email, password } = this.loginForm.value;
      this.subscriptions.push(
        this.authService.login(email, password).subscribe(success => {
          if (success) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
          }
          this.loadingService.isLoading.next(false);
        })
      );
    } else {
      this.loadingService.isLoading.next(false);
      this.displayFailedLogin();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private displayFailedLogin() {
    const failedLogin = new Alert(
      "We could not find you. Try again!",
      AlertType.Danger
    );
    this.alertService.alerts.next(failedLogin);
  }
}

import { LoadingService } from "./../../services/loading.service";
import { AuthService } from "./../../services/auth.service";
import { Subscription } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertType } from "src/app/enums/alert-type.enum";
import { Alert } from "./../../classes/alert";
import { AlertService } from "./../../services/alert.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  private subscriptions: Array<Subscription> = [];

  constructor(
    fb: FormBuilder,
    private alertService: AlertService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    this.signupForm = fb.group({
      firstName: ["", [Validators.required]],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(5)]]
    });
  }

  submit(): void {
    if (this.signupForm.valid) {
      const { firstName, lastName, email, password } = this.signupForm.value;
      this.subscriptions.push(
        this.authService
          .signup(firstName, lastName, email, password)
          .subscribe(success => {
            if (success) {
              this.router.navigate(["/chat"]);
            } else {
              const failedSignedupAlert = new Alert(
                "There was a problem signing up, try again",
                AlertType.Danger
              );
              this.alertService.alerts.next(failedSignedupAlert);
            }
            this.loadingService.isLoading.next(false);
          })
      );
    } else {
      const failedSignedupAlert = new Alert(
        "Please enter a valid name, email and password, try again",
        AlertType.Danger
      );
      this.alertService.alerts.next(failedSignedupAlert);
    }
  }

  ngOnInit() {}

  ngOnDestroy() {}
}

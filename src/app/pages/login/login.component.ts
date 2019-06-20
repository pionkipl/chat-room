import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertType } from "src/app/enums/alert-type.enum";
import { Alert } from "./../../classes/alert";
import { AlertService } from "./../../services/alert.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(fb: FormBuilder, private alertService: AlertService) {
    this.loginForm = fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(5)]]
    });
  }

  submit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log(`Email: ${email} Password: ${password}`);
    } else {
      const failedLogin = new Alert(
        "Your email or password were invalid, try again.",
        AlertType.Success
      );
      this.alertService.alerts.next(failedLogin);
      console.log("failed");
    }
  }

  ngOnInit() {}
}

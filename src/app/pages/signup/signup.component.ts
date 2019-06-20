import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertType } from "src/app/enums/alert-type.enum";
import { Alert } from "./../../classes/alert";
import { AlertService } from "./../../services/alert.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(fb: FormBuilder, private alertService: AlertService) {
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
      console.log(
        `FirstName: ${firstName} LastName: ${lastName}Email: ${email} Password: ${password}`
      );
    } else {
      const failedLogin = new Alert(
        "Your name, email or password were invalid, try again.",
        AlertType.Success
      );
      this.alertService.alerts.next(failedLogin);
    }
  }

  ngOnInit() {}
}

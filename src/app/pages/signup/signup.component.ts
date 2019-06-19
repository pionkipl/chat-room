import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.signupForm = fb.group({
      firstName: ["", [Validators.required]],
      lastName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(5)]]
    });
  }

  submit(): void {
    const { firstName, lastName, email, password } = this.signupForm.value;
    console.log(
      `FirstName: ${firstName} LastName: ${lastName}Email: ${email} Password: ${password}`
    );
  }

  ngOnInit() {}
}

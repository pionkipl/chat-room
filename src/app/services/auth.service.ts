import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { AlertType } from "./../enums/alert-type.enum";
import { Alert } from "./../classes/alert";
import { AlertService } from "./alert.service";
import { of, from, Subscription } from "rxjs";
import { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { switchMap } from "rxjs/operators";
import { User } from "../interfaces/user";

@Injectable({
  providedIn: "root"
})
export class AuthService implements OnDestroy {
  currentUser: Observable<User | null>;
  currentUserSnapshot: User | null;
  subscriptions: Array<Subscription> = [];

  constructor(
    private router: Router,
    private alertService: AlertService,
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore
  ) {
    this.currentUser = this.angularFireAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.angularFirestore
            .doc<User>(`users/${user.uid}`)
            .valueChanges();
        } else {
          return of(null);
        }
      })
    );

    this.setCurrentUserSnapshot();
  }

  ngOnDestroy() {}

  signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Observable<boolean> {
    return from(
      this.angularFireAuth.auth
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          const userRef: AngularFirestoreDocument<
            User
          > = this.angularFirestore.doc(`users/${user.user.uid}`);
          const updatedUser = {
            id: user.user.uid,
            email: user.user.email,
            firstName,
            lastName,
            photoUrl:
              "https://firebasestorage.googleapis.com/v0/b/chat-room-efcd6.appspot.com/o/avatar.png?alt=media&token=e9d8d334-fe16-41dc-af1a-c2301a2f562c",
            quote: "I am a man who wants to acquire new Angular skills"
          };
          if (userRef) {
            userRef.set(updatedUser);
          }
          return true;
        })
        .catch(err => false)
    );
  }

  login(email: string, password: string) {
    return from(
      this.angularFireAuth.auth
        .signInWithEmailAndPassword(email, password)
        .then(user => true)
        .catch(() => {
          this.alertService.alerts.next(
            new Alert(
              "Your login and password does not match!",
              AlertType.Danger
            )
          );
        })
    );
  }

  logout(): void {
    this.angularFireAuth.auth.signOut().then(() => {
      this.router.navigate(["/login"]);
      this.alertService.alerts.next(new Alert("You have been sign out!"));
    });
  }

  private setCurrentUserSnapshot(): void {
    this.subscriptions.push(
      this.currentUser.subscribe(user => (this.currentUserSnapshot = user))
    );
  }
}

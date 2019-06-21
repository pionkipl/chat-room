import { User } from "./../../interfaces/user";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { LoadingService } from "./../../services/loading.service";
import { AuthService } from "./../../services/auth.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  currentUser: any = null;
  user: User;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private angularFirestore: AngularFirestore
  ) {
    this.loadingService.isLoading.next(false);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
        this.loadingService.isLoading.next(false);
      })
    );

    this.subscriptions.push(
      this.route.paramMap.subscribe(params => {
        const userId = params.get("userId");
        const userRef: AngularFirestoreDocument<
          User
        > = this.angularFirestore.doc(`users/${userId}`);
        userRef.valueChanges().subscribe(user => (this.user = user));
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

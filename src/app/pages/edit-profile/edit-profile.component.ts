import { AlertType } from "./../../enums/alert-type.enum";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { LoadingService } from "./../../services/loading.service";
import { AuthService } from "./../../services/auth.service";
import { Subscription } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFirestore } from "@angular/fire/firestore";
import { finalize } from "rxjs/operators";
import { User } from "./../../interfaces/user";
import { AlertService } from "src/app/services/alert.service";
import { Location } from "@angular/common";
import { Alert } from "./../../classes/alert";
import { map } from "rxjs/operators";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"]
})
export class EditProfileComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  userId: string = "";
  subscriptions: Array<Subscription> = [];
  uploadPercent: number = 0;
  downloadUrl: string | null = null;

  constructor(
    private auth: AuthService,
    private loadingservice: LoadingService,
    private route: ActivatedRoute,
    private angularFireStorage: AngularFireStorage,
    private angularFirestore: AngularFirestore,
    private location: Location,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.auth.currentUser.subscribe(user => {
        this.currentUser = user;
        this.loadingservice.isLoading.next(false);
      })
    );

    this.subscriptions.push(
      this.route.paramMap.subscribe(params => {
        this.userId = params.get("userId");
      })
    );
  }

  uploadFile(e): void {
    const file = e.target.files[0];
    const filePath = `${file.name}_${this.currentUser.id}`;
    const fileRef = this.angularFireStorage.ref(filePath);
    const task = this.angularFireStorage.upload(filePath, file);

    this.subscriptions.push(
      task.percentageChanges().subscribe(percentage => {
        if (percentage < 100) {
          this.loadingservice.isLoading.next(true);
        } else {
          this.loadingservice.isLoading.next(false);
        }
        this.uploadPercent = percentage;
      })
    );

    this.subscriptions.push(
      fileRef.getDownloadURL().subscribe(url => (this.downloadUrl = url))
    );
  }

  save(): void {
    let photo;
    if (this.downloadUrl) {
      photo = this.downloadUrl;
    } else {
      photo = this.currentUser.photoUrl;
    }

    const user = Object.assign({}, this.currentUser, { photoUrl: photo });
    const userRef = this.angularFirestore.doc(`users/${user.id}`);
    userRef.set(user);
    this.alertService.alerts.next(
      new Alert("Your profile was successfully opdated!", AlertType.Success)
    );
    this.location.back();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

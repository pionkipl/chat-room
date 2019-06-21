import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Observable, BehaviorSubject, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ChatroomService {
  chatrooms: Observable<any>;
  changeChatroom: BehaviorSubject<string | null> = new BehaviorSubject(null);
  selectedChatroom: Observable<any>;
  slectedChatroomMessages: Observable<any>;
  constructor(
    private angularFirestore: AngularFirestore,
    private authService: AuthService
  ) {
    this.selectedChatroom = this.changeChatroom.pipe(
      switchMap(chatroomId => {
        if (chatroomId) {
          return angularFirestore.doc(`chatrooms/${chatroomId}`).valueChanges();
        }
        return of(null);
      })
    );

    this.slectedChatroomMessages = this.changeChatroom.pipe(
      switchMap(chatroomId => {
        if (chatroomId) {
          return angularFirestore
            .collection(`chatrooms/${chatroomId}/messages`, ref => {
              return ref.orderBy("createdAt", "desc").limit(60);
            })
            .valueChanges()
            .pipe(map(arr => arr.reverse()));
        }
        return of(null);
      })
    );
    this.chatrooms = this.angularFirestore
      .collection("chatrooms")
      .valueChanges();
  }

  createMessage(text: string): void {
    const chatroomId = this.changeChatroom.value;
    const message = {
      message: text,
      createdAt: new Date(),
      sender: this.authService.currentUserSnapshot
    };

    this.angularFirestore
      .collection(`chatrooms/${chatroomId}/messages`)
      .add(message);
  }
}

import { Message } from "./../../../../classes/message";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewChecked,
  ElementRef,
  ViewChild
} from "@angular/core";
import { ChatroomService } from "src/app/services/chatroom.service";

@Component({
  selector: "app-chatroom-window",
  templateUrl: "./chatroom-window.component.html",
  styleUrls: ["./chatroom-window.component.scss"]
})
export class ChatroomWindowComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild("scrollContainer", { static: false })
  private scrollContainer: ElementRef;

  chatroom: Observable<any>;
  messages: Observable<any>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private route: ActivatedRoute,
    private chatroomService: ChatroomService
  ) {
    this.subscriptions.push(
      this.chatroomService.selectedChatroom.subscribe(chatroom => {
        this.chatroom = chatroom;
      })
    );

    this.subscriptions.push(
      this.chatroomService.slectedChatroomMessages.subscribe(messages => {
        this.messages = messages;
      })
    );
  }

  ngOnInit() {
    this.scrollToBottom();
    this.subscriptions.push(
      this.route.paramMap.subscribe(params => {
        const chatroomId = params.get("chatroomId");
        this.chatroomService.changeChatroom.next(chatroomId);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}

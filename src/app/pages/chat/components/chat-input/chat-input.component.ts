import { ChatroomService } from "src/app/services/chatroom.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-chat-input",
  templateUrl: "./chat-input.component.html",
  styleUrls: ["./chat-input.component.scss"]
})
export class ChatInputComponent implements OnInit {
  newMessageText: string = "";

  constructor(private chatroomService: ChatroomService) {}

  ngOnInit() {}

  submit(message: string): void {
    this.chatroomService.createMessage(message);

    this.newMessageText = "";
  }
}

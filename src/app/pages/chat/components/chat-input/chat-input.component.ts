import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-chat-input",
  templateUrl: "./chat-input.component.html",
  styleUrls: ["./chat-input.component.scss"]
})
export class ChatInputComponent implements OnInit {
  newMessageText: string = "";

  constructor() {}

  ngOnInit() {}

  submit(message: string): void {
    console.log("New Message: ", message);

    this.newMessageText = "";
  }
}

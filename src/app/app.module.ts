import { LoadingService } from "./services/loading.service";
// Services
import { AlertService } from "./services/alert.service";
import { AuthService } from "./services/auth.service";

// Modules
import { AlertModule } from "ngx-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgxLoadingModule } from "ngx-loading";

import { AppComponent } from "./app.component";
import { ChatInputComponent } from "./pages/chat/components/chat-input/chat-input.component";
import { ChatroomListComponent } from "./pages/chat/components/chatroom-list/chatroom-list.component";
import { ChatroomTitleBarComponent } from "./pages/chat/components/chatroom-title-bar/chatroom-title-bar.component";
import { ChatMessageComponent } from "./pages/chat/components/chat-message/chat-message.component";
import { ChatroomWindowComponent } from "./pages/chat/components/chatroom-window/chatroom-window.component";
import { LoginComponent } from "./pages/login/login.component";

import { ChatIconComponent } from "./pages/chat/components/chat-icon/chat-icon.component";
import { SignupComponent } from "./pages/signup/signup.component";
import { ChatComponent } from "./pages/chat/chat.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { AlertDirective } from "./directives/alert.directive";

@NgModule({
  declarations: [
    AppComponent,
    ChatInputComponent,
    ChatroomListComponent,
    ChatroomTitleBarComponent,
    ChatMessageComponent,
    ChatroomWindowComponent,
    LoginComponent,
    ChatIconComponent,
    SignupComponent,
    ChatComponent,
    NavbarComponent,
    AlertDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AlertModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({})
  ],
  providers: [AlertService, LoadingService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {}

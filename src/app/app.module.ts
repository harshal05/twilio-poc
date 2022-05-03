import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LiveChatComponent } from './live-chat/live-chat.component';
import { TwilioService } from './twilio.service';

@NgModule({
  declarations: [
    AppComponent,
    LiveChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [TwilioService],
  bootstrap: [AppComponent]
})
export class AppModule { }

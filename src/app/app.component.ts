import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isPin = false;

  ngAfterInitView() {
    // console.log(LiveChatWidget);
  }
}

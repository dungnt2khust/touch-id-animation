import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TouchIDModule } from './components/touch-id/touch-id.module';

@NgModule({
  imports: [BrowserModule, FormsModule, TouchIDModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

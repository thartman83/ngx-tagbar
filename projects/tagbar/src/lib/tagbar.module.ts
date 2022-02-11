import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TagbarComponent } from './tagbar.component';


@NgModule({
  declarations: [TagbarComponent],
  imports: [
    BrowserModule
  ],
  exports: [TagbarComponent]
})
export class TagbarModule { }

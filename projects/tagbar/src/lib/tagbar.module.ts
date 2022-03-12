import { NgModule } from '@angular/core';
import { TagbarComponent } from './tagbar.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    TagbarComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    TagbarComponent
  ]
})
export class TagbarModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TagbarComponent } from './tagbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TagbarComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [TagbarComponent],
  exports: [TagbarComponent]
})
export class TagbarModule { }

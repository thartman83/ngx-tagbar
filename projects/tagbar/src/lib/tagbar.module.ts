import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TagbarComponent } from './tagbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListItemComponent } from './list-item/list-item.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [TagbarComponent, ListItemComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  bootstrap: [TagbarComponent],
  exports: [TagbarComponent]
})
export class TagbarModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TagbarComponent } from './tagbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListItemComponent } from './list-item/list-item.component';

@NgModule({
  declarations: [TagbarComponent, ListItemComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [TagbarComponent],
  exports: [TagbarComponent]
})
export class TagbarModule { }

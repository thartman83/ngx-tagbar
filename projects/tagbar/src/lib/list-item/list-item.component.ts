import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {
  private _tagValue: string = '';
  private _idx: number = -1;

  selected: boolean = false;
  hilighted: boolean = false;

  @Input('tagValue')
  get tagValue(): string { return this._tagValue; }
  set tagValue(value: string) { this._tagValue = value; }

  @Input('index')
  get index(): number { return this._idx }
  set index(value: number) { this._idx = value; }

  @Output() select = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  onMouseEnter() {
    this.hilighted = true;
  }

  onMouseLeave() {
    this.hilighted = false;
  }

  onMouseDown() {
    this.select.emit(this._idx);
  }

}

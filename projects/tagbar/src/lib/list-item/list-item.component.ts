import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {
  private _tagValue: string = '';
  private _idx: number = -1;
  private _selected: boolean = false;
  private _highlighted: boolean = false;

  @Input('tagValue')
  get tagValue(): string { return this._tagValue; }
  set tagValue(value: string) { this._tagValue = value; }

  @Input('index')
  get index(): number { return this._idx }
  set index(value: number) { this._idx = value; }

  @Input('selected')
  get selected(): boolean { return this._selected; }
  set selected(value: boolean) { this._selected = value; }

  @Input('highlighted')
  get highlighted(): boolean { return this._highlighted; }
  set highlighted(value: boolean) { this._highlighted = value; }


  @Output() select = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  onMouseEnter() {
    this.highlighted = true;
  }

  onMouseLeave() {
    this.highlighted = false;
  }

  onMouseDown() {
    this.select.emit(this._idx);
  }

}

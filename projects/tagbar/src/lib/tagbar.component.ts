import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'ngx-tagbar',
  templateUrl: 'tagbar.component.html',
  styleUrls: ['./tagbar.component.scss' ]
})
export class TagbarComponent implements OnInit {

  private _tags: string[] = [];
  private _tagColor: string = '#666666';
  private _limited: boolean = false;
  private _source: string[] | ((needle: string) => string[]) = [];

  @HostBinding("style.--tag-color")
  @Input('tag-color')
  get tagColor(): string {
    return this._tagColor;
  }
  set tagColor(value: string) {
    this._tagColor = value || '#666666';
  }

  @Input('tags')
  get tags(): string[] {
    return this._tags;
  }
  set tags(tags: string[]) {
    this._tags = tags;
  }

  @Input('limited')
  get limited(): boolean {
    return this._limited;
  }
  set limited(limited) {
    this._limited = limited;
  }

  @Input('source')
  get source(): string[] | ((needle: string) => string[]) {
    return this._source;
  }
  set source(source) {
    this._source = source;
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  addTag(newTag: string) {

    if(newTag === '')
      return;

    const idx = this.findTag(newTag);

    if(idx > -1) {
      return;
    }

    this._tags.push(newTag);
  }

  removeTag(tag: string) {
    const idx = this.findTag(tag);
    if(idx > -1) {
      this._tags.splice(idx,1);
    }
  }

  findTag(tag: string) {
    return this._tags.indexOf(tag, 0);
  }

  getMatchingSourceTags(needle: string) : string[] {
    if(typeof(this._source) === 'function') {
      return this._source(needle);
    } else {
      return this._source.filter((tag) => tag.indexOf(needle) !== -1);
    }
  }
}

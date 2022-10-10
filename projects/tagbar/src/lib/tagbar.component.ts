import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Observable, isObservable } from 'rxjs';

const defaultTagColor = '#666666'

type asyncSourceFnType = (needle: string) => string[];
type sourceFnType = (needle: string) => string[];

@Component({
  selector: 'ngx-tagbar',
  templateUrl: 'tagbar.component.html',
  styleUrls: ['./tagbar.component.scss']
})
export class TagbarComponent implements OnInit {
  private _tags: string[] = [];
  private _tagColor: string = defaultTagColor;
  private _limited: boolean = false;
  private _source: string[] | sourceFnType | Observable<string[]> = undefined;
  private _asyncSource: asyncSourceFnType = undefined;
  private _maxTags: number = -1;
  private _minimumInput: number = 0;
  private _searchTags: string[] = null;
  private _searchIndex: number = -1;

  isSearching: boolean = false;
  inputTag = '';
  dataPending: boolean = false;

  @HostBinding("style.--tag-color")
  @Input('tag-color')
  get tagColor(): string { return this._tagColor; }
  set tagColor(value: string) { this._tagColor = value || defaultTagColor; }

  @Input('tags')
  get tags(): string[] { return this._tags; }
  set tags(tags: string[]) { this._tags = tags; }

  @Input('limited')
  get limited(): boolean { return this._limited; }
  set limited(limited) { this._limited = limited; }

  @Input('source')
  get source(): string[] | sourceFnType | Observable<string[]> { return this._source; }
  set source(source) { this._source = source; }

  @Input('asyncSource')
  get asyncSource(): asyncSourceFnType { return this._asyncSource; }
  set asyncSource(source: asyncSourceFnType) { this._asyncSource = source; }

  @Input('maxTags')
  get maxTags(): number { return this._maxTags; }
  set maxTags(maxTags: number) { this._maxTags = maxTags }

  @Input('minimumInput')
  get minimumInput(): number { return this._minimumInput; }
  set minimumInput(minimumInput: number) { this._minimumInput = minimumInput; }

  constructor() {}

  ngOnInit(): void {}

  /// *** Public Methods *** ///
  addTag(newTag: string) {
    // strip the whitespace from the beginning and ending of the tag
    newTag = newTag.trim();

    // Stop searching if we are actively doing so
    if (this.isSearching)
      this.closeSearch();

    // Don't add a blank tag
    if (newTag === '')
      return;

    // Don't add more tags than maxTags
    if (this.maxTags !== -1 && this.maxTags === this.tags.length)
      return;

    // Don't add a tag that already exists
    const idx = this.findTag(newTag);
    if (idx > -1) {
      return;
    }

    // Add the tag
    this._tags.push(newTag);

    // clear the text input
    this.clear();
  }

  removeTag(tag: string) {
    const idx = this.findTag(tag);
    if (idx > -1) {
      this._tags.splice(idx, 1);
    }
  }

  findTag(tag: string) {
    return this._tags.indexOf(tag, 0);
  }

  searchIndex(): number {
    return this._searchIndex;
  }

  clear(): void {
    this.inputTag = '';
  }

  ///*** Private Methods ***///
  private closeSearch(): void {
    this.isSearching = false;
    this._searchIndex = -1;
  }

  ///***  event functions  ***///
  onBlur(newTag: string) {
    let tag = newTag;

    if (tag !== "")
      this.addTag(tag);

    if (this.isSearching)
      this.closeSearch();
  }

  deleteNewestTag(needle: string): void {
    this._tags.splice(this._tags.length - 1, 1)
  }

  onKeyDown(event: KeyboardEvent, needle: string): void {

    switch (event.key) {
      case "Enter":
        this.onEnterKey(needle);
        break;
      case "Backspace":
        let inputEL = event.target as HTMLInputElement;
        if (inputEL.selectionStart === 0)
          this.deleteNewestTag(needle);
        else
          this.displaySearchTags(needle);
        break;
      case "ArrowDown":
        this.onArrowDown(needle);
        break;
      case "ArrowUp":
        this.onArrowUp(needle);
        break;
      case "Escape":
        this.onEscape();
        break;
      default:
        let newNeedle = needle + event.key;

        this.searchSource(newNeedle);
        break;
    }
  }

  onKeyUp(event: KeyboardEvent, needle: string): void {
    switch (event.key) {
      case "Enter":
      case "Backspace":
      case "ArrowDown":
      case "ArrowUp":
      case "Escape":
      default:
        break;
    }
  }

  onEnterKey(needle: string): void {
    if (this.isSearching) {
      this.addTag(this._searchTags[this._searchIndex]);
    } else {
      this.addTag(needle);
    }
  }

  onFocus(needle: string): void {
    if (this.shouldSearch(needle)) {
      this._searchIndex = 0;
      this.displaySearchTags(needle);
    }
  }

  onArrowDown(needle: string): void {
    if (this.shouldSearch(needle) && !this.isSearching) {
      this.displaySearchTags(needle);
    }

    if (this._searchIndex < (this._searchTags.length - 1)) {
      this._searchIndex += 1;

    }
  }

  onArrowUp(needle: string): void {
    if (this._searchIndex > 0) {
      this._searchIndex -= 1;
    }
  }

  onHoverSearchItem(idx: number): void {
    this._searchIndex = idx;
  }

  onEscape(): void {
    this.closeSearch();
  }

  findFirstSearchItem(needle: string): number {
    return this._searchTags.findIndex((n) => n.indexOf(needle) !== -1);
  }

  shouldSearch(needle: string): boolean {
    return this.hasSource() && needle.length >= this.minimumInput;
  }

  displaySearchTags(needle) {
    if (typeof this.source === 'function') {
      this._searchTags = this.source(needle);
    } else if(isObservable(this.source)) {
      this.dataPending = true;
      this.source.subscribe(data => {
        let retval = data.filter((val) => val.indexOf(needle) !== -1);
        this._searchTags = retval;
        this.dataPending = false;
      });
    } else {
      this._searchTags = this.source;
    }

    this.isSearching = true;
  }

  searchSource(needle: string): void {

    if (this.shouldSearch(needle)) {

      if (typeof this.source === 'function') {
        this.displaySearchTags(needle);
      } else {
        this.displaySearchTags(needle);
      }

      this._searchIndex = this.findFirstSearchItem(needle);
    }
  }

  hasSource(): boolean {
    return this.source !== undefined || this.asyncSource !== undefined;
  }

  addSearchItem(searchItem: string): void {
    this.addTag(searchItem);
  }
}

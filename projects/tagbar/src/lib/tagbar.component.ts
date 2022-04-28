import { Component, OnInit, Input, HostBinding } from '@angular/core';

const defaultTagColor = '#666666'

@Component({
  selector: 'ngx-tagbar',
  templateUrl: 'tagbar.component.html',
  styleUrls: ['./tagbar.component.scss' ]
})
export class TagbarComponent implements OnInit {

  private _tags: string[] = [];
  private _tagColor: string = defaultTagColor;
  private _limited: boolean = false;
  private _source: string[] | ((needle: string) => string[]) = [];
  private _maxTags: number = -1;
  private _minimumInput: number = 0;
  private _searchTags: string[] = null;
  private _searchIndex: number = -1;
  
  isSearching: boolean = false;

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
  get source(): string[] | ((needle: string) => string[]) { return this._source; }
  set source(source) { this._source = source; }

  @Input('maxTags')
  get maxTags(): number { return this._maxTags; }
  set maxTags(maxTags: number) { this._maxTags = maxTags }

  @Input('minimumInput')
  get minimumInput(): number { return this._minimumInput; }
  set minimumInput(minimumInput: number) { this._minimumInput = minimumInput ;}

  constructor() { }

  ngOnInit(): void { }

  /// *** Public Methods *** ///
  addTag(newTag: string) {
    // strip the whitespace from the beginning and ending of the tag
    newTag = newTag.trim();

    // Stop searching if we are actively doing so
    if(this.isSearching)
      this.closeSearch();
    
    // Don't add a blank tag
    if(newTag === '')
      return;

    // Don't add more tags than maxTags
    if(this.maxTags !== -1 && this.maxTags === this.tags.length) 
      return;

    // Don't add a tag that already exists
    const idx = this.findTag(newTag);
    if(idx > -1) {
      return;
    }

    // Add the tag
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

  searchIndex(): number {
    return this._searchIndex;
  }

  ///*** Private Methods ***///
  private closeSearch(): void {
    this.isSearching = false;
    this._searchIndex = -1;
  }

  ///***  event functions  ***///
  onBlur(newTag: string) {
    let tag = newTag;
    
    if(tag !== "")
      this.addTag(tag);

    if(this.isSearching)
      this.closeSearch();
  }

  deleteNewestTag(newTag: string) {
    if(newTag !== "") {
      return;
    }

    this._tags.splice(this._tags.length-1, 1)
  }

  onEnterKey(needle: string) : void {
    if(this.isSearching) {
      this.addTag(this._searchTags[this._searchIndex]);
    } else {
      this.addTag(needle);
    }
  }
  
  onFocus(needle: string) : void {
    if(this.source.length !== 0 && needle.length >= this.minimumInput) {
      this._searchIndex = 0;
      this.displaySearchTags(this.source as string[]);
    }
  }

  onArrowDown(needle: string) : void {
    if(this.source.length !== 0 && needle.length >= this.minimumInput &&
       !this.isSearching) {
      this.displaySearchTags(this.source as string[]);
    }
    
    if(this._searchIndex < (this._searchTags.length - 1)) {
      this._searchIndex += 1;
    }
  }

  onArrowUp(needle: string) : void {
    if(this._searchIndex > 0) {
      this._searchIndex -= 1;
    }
  }

  onHoverSearchItem(idx: number) : void {
    this._searchIndex = idx;
  }

  onEscape(): void {
    this.closeSearch();
  }

  displaySearchTags(searchTags: string[]) {
    this.isSearching = true;
    this._searchTags = searchTags;
  }

  addSearchItem(searchItem: string) : void {
    this.addTag(searchItem);
  }
}

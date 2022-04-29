import { Testability } from '@angular/core';
import { ComponentFixture, TestBed, tick, fakeAsync, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TagbarComponent } from './tagbar.component';

describe('TagbarComponent', () => {

  describe(`unit tests`, () => {

    let component: TagbarComponent;
    let initialTags = ['foo', 'bar', 'baz'];
    let initialLen = initialTags.length;

    describe('::constructor', () => {
      it('should create', () => {
	component = new TagbarComponent();
	component.ngOnInit();

	expect(component).toBeTruthy();
      });
    });

    describe('::addTag', () => {
      it(`should add a tag when tag doesn't exist`, () => {
	component = new TagbarComponent();
	component.ngOnInit();

	let tagName = 'foo';
	component.addTag(tagName);
	expect(component.tags.indexOf(tagName)).toBeGreaterThan(-1);


	let secondTag = 'bar';
	component.addTag(secondTag);
	expect(component.tags.indexOf(secondTag)).toBeGreaterThan(-1);
      });

      it(`should not add a tag if the tag already exists`, () => {
	component = new TagbarComponent();
	component.tags = Object.assign([], initialTags);
	component.ngOnInit();

	let existingTag = initialTags[0];
	component.addTag(existingTag);
	expect(component.tags.length).toBe(initialLen);
      });

      it(`should not add a tag if maxTags is set to 3 and there are 3 tags`, () =>{
	component = new TagbarComponent();
	component.tags = Object.assign([], initialTags);
	component.maxTags = 3;
	component.ngOnInit();

	let newTag = 'bob';
	component.addTag(newTag);
	expect(component.tags.length).toEqual(initialLen);
	expect(component.tags.indexOf(newTag)).toEqual(-1);
      });

      it('should not add a blank tag (all whitespace)', () => {
	component = new TagbarComponent();
	component.ngOnInit();

	let newTag = '	  ';
	component.addTag(newTag);
	expect(component.tags.length).toEqual(0);
      });

      it('should trim white space from the beginning and end of tags', () => {
	component = new TagbarComponent();
	component.ngOnInit();

	let newTag = '	 foo   ';
	component.addTag(newTag);
	expect(component.tags.length).toEqual(1);
	expect(component.tags.indexOf(newTag.trim())).toEqual(0);
      });
    });

    describe('::removeTag', () => {
      it('should remove a tag when removeTag is called', () => {
	component = new TagbarComponent();
	component.tags = Object.assign([], initialTags);
	component.ngOnInit();

	let toRemove = 'foo';
	component.removeTag(toRemove);
	expect(component.tags.length).toBe(initialTags.length - 1);
	expect(component.tags.indexOf(toRemove)).toBe(-1);
      });

      it('should not remove a non-existant tag', () =>{
	component = new TagbarComponent();
	component.tags = Object.assign([], initialTags);
	component.ngOnInit();

	let nonExistingTag = 'bob';
	component.removeTag(nonExistingTag);
	expect(component.tags.length).toBe(initialLen);
      });
    });

    // getMatchingSourceTags unit tests
    describe('::getMatchingSourceTags', () => {
      it(`should return 2 tags ['bar', 'baz'] called with a 'b'`, () => {
	component = new TagbarComponent();
	component.source = Object.assign([], initialTags);
	component.ngOnInit();

	let res = component.getMatchingSourceTags('b');
	expect(res.length).toEqual(2);

	let fn = (needle: string): string[] => {
	  return initialTags.filter((tag) => tag.indexOf(needle) !== -1);
	}

	component.source = fn;
	expect(component.getMatchingSourceTags('b').length).toEqual(2);
      });

      if(`should return 2 tags ['bar', 'baz']`)

	it('should return nothing when there is no source', () =>{
	  component = new TagbarComponent();
	  component.ngOnInit();

	  let res = component.getMatchingSourceTags('foo');
	  expect(res.length).toEqual(0);
	});
    });
  });

  describe('functional tests', () => {
    let component: TagbarComponent;
    let fixture: ComponentFixture<TagbarComponent>;

    beforeEach(async() => {
      await TestBed.configureTestingModule({
	declarations: [TagbarComponent]
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TagbarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it(`should create`, () => {
      expect(component).toBeTruthy();
    });

    it(`should add a tag when entered into the keyboard`, () => {      
      const de = fixture.debugElement;
      const tagname = 'foobar';
      const i = de.query(By.css('.tagbar--input')).nativeElement;

      // add the tag
      i.value = tagname;
      i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' } ));
      
      expect(component.tags.length).toEqual(1);
      expect(component.tags).toContain(tagname);      
    });

    it('should add a tag when the input field has a value and it losses focus', () => {
      const de = fixture.debugElement;
      const tagname = 'foobar';
      const i = de.query(By.css('.tagbar--input')).nativeElement;

      i.value = tagname;
      i.dispatchEvent(new Event('blur'));
      
      expect(component.tags.length).toEqual(1);
      expect(component.tags).toContain(tagname);      
    });

    it('should focus the input element when the component is clicked on', () => {
      const de = fixture.debugElement;
      const i = de.query(By.css('.tagbar--input')).nativeElement;
      const compEl = de.query(By.css('.tagbar--parent')).nativeElement;

      spyOn(i, 'focus');
      spyOn(compEl, 'focus')
      compEl.dispatchEvent(new Event('click'));
      expect(i.focus).toHaveBeenCalled();
      expect(compEl.focus).not.toHaveBeenCalled();
    });

    it('should show the search options when isSearching is true', () => {
      const de = fixture.debugElement;

      // Should not be displayed here
      expect(de.query(By.css('.tagbar--search'))).toBeNull();
      // start searching....
      component.isSearching = true;
      fixture.detectChanges();

      // Should be displayed here
      expect(de.query(By.css('.tagbar--search')).nativeElement).toBeTruthy();
    });

    describe(`Removing a tag`, () => {
      it(`when a tage is present
          should remove a tag when the tag 'X' button is clicked`,
	 fakeAsync( () => {
	   let tag = 'foo';
	   let otherTag = 'bar';
	   component.addTag(tag)
	   component.addTag(otherTag);
	   fixture.detectChanges();
	   
	   expect(component.tags.length).toEqual(2);
	   expect(component.tags.indexOf(tag)).not.toEqual(-1);
	   expect(component.tags.indexOf(otherTag)).not.toEqual(-1);
	   
	   const de = fixture.debugElement;
	   const btn = de.query(By.css('.tagbar--tag-selected-remove-tag-btn')).
	     nativeElement;

	   btn.click();
	   tick();
	   fixture.detectChanges();
	   
	   expect(component.tags.length).toEqual(1);
	   expect(component.tags.indexOf(tag)).toEqual(-1);
	   expect(component.tags.indexOf(otherTag)).not.toEqual(-1);
	 }));

      
      it(`when a tag is present,
          should remove the left most tag when backspace is pressed`,
	 fakeAsync( () => {
	   component.addTag('foo');
	   component.addTag('bar');
	 
	   expect(component.tags.length).toEqual(2);	 

	   const de = fixture.debugElement;	 
	   const i = de.query(By.css('.tagbar--input')).nativeElement;

	   // simulate a backspace message
	   i.dispatchEvent(new KeyboardEvent('keydown', {
	     "key": "backspace"
	   }));
	   tick();
	   fixture.detectChanges();

	   expect(component.tags.length).toEqual(1);
       }));

    });

    describe('Static source', () => {

      it(`when a static source is not present
          should never show the blank source list`, fakeAsync(() => {
	    const de = fixture.debugElement;

	    expect(de.query(By.css('.tagbar--search'))).toBeNull();
	    component.onFocus('');
	    tick();
	    
	    expect(de.query(By.css('.tagbar--search'))).toBeNull();
	  }));
      
      it(`when a static source is present
          when minimumInput is 0
	  should display the list from the source when input is focused`,
         fakeAsync( () => {
	 
	   const de = fixture.debugElement;	 
	   const i = de.query(By.css('.tagbar--input')).nativeElement;
	   const searchTags = ['foo','bar','baz'];

	   component.source = searchTags;
	   component.minimumInput = 0;
	   expect(component.isSearching).toBeFalse();
	   
	   // check that the focus event is fired whe the object is clicked on
	   spyOn(i, 'focus'); 
	   i.click();
	   tick();
	   expect(i.focus).toHaveBeenCalled();
	   
	   // Call the method directly
	   component.onFocus('');
	 
	   fixture.detectChanges();
	   expect(component.isSearching).toBeTrue();
	   
	   expect(de.query(By.css('.tagbar--search')).nativeElement).toBeTruthy();
	   expect(de.query(By.css('.tagbar--search-list')).children.length).toEqual(searchTags.length);	 
	 }));

      it(`when a static source is present
          when minimumInput is 1
          should not display the list when the input is focued`,
	 fakeAsync( () => {
	   const searchTags = ['foo','bar','baz'];

	   component.source = searchTags;
	   component.minimumInput = 1;
	   expect(component.isSearching).toBeFalse();

	   component.onFocus('');
	   expect(component.isSearching).toBeFalse();
	 }));

      it(`when a static source is present
          when minimumInput is 1
          should dipslay the list when the input has 1 character`,
	 fakeAsync( () => {
	   const de = fixture.debugElement;	 
	   const i = de.query(By.css('.tagbar--input')).nativeElement;
	   const searchTags = ['foo','bar','baz'];

	   component.source = searchTags;
	   component.minimumInput = 1;
	   expect(component.isSearching).toBeFalse();

	   component.onFocus('');
	   expect(component.isSearching).toBeFalse();

	   component.onFocus('f');
	   
	   fixture.detectChanges();
	   expect(component.isSearching).toBeTrue();
	 }));
      
      it(`when a static source is present
          when the tagbar is searching
          up and down arrows should highligh searchable values`,
	 fakeAsync( () => {
	   const de = fixture.debugElement;	 
	   const i = de.query(By.css('.tagbar--input')).nativeElement;
	   const searchTags = ['foo','bar','baz'];
	   const focusedClass = '.tagbar--search-list-item-active'

	   component.source = searchTags;

	   component.isSearching = true;
	   fixture.detectChanges();

	   component.onFocus('');
	   fixture.detectChanges();
	   expect(de.query(By.css(focusedClass)).nativeElement.innerText).toEqual('foo');
	   
	   component.onArrowDown('');
	   fixture.detectChanges();
	   expect(de.query(By.css(focusedClass)).nativeElement.innerText).toEqual('bar');

	   component.onArrowDown('');
	   fixture.detectChanges();
	   expect(de.query(By.css(focusedClass)).nativeElement.innerText).toEqual('baz');

	   component.onArrowUp('');
	   fixture.detectChanges();
	   expect(de.query(By.css(focusedClass)).nativeElement.innerText).toEqual('bar');
	 }));

      it(`when a static source is present
          when the tagbar is searching
          when the enter key is pressed 
          should select a hilighted search option`,
	 fakeAsync( () => {
	   const de = fixture.debugElement;	 
	   const i = de.query(By.css('.tagbar--input')).nativeElement;
	   const searchTags = ['foo','bar','baz'];

	   component.source = searchTags;

	   component.onFocus('');
	   component.onEnterKey('');
	   fixture.detectChanges();

	   expect(component.tags).toContain('foo');
	   expect(component.isSearching).toBeFalse();
	   expect(component.searchIndex()).toBe(-1);

	   component.onFocus('');
	   component.onArrowDown('');
	   component.onEnterKey('');

	   expect(component.tags).toContain('bar');
	   expect(component.isSearching).toBeFalse();
	   expect(component.searchIndex()).toBe(-1);
	 }));
    });

    it(`when a static source is present
        when the tagbar is not search
        when the down key is pressed
        when minimum input is 0
        should show the search tags`,
       fakeAsync(()=> {
	 const de = fixture.debugElement;	 
	 const i = de.query(By.css('.tagbar--input')).nativeElement;
	 const searchTags = ['foo','bar','baz'];

	 component.source = searchTags;
	 expect(component.isSearching).toBeFalse();

	 component.onArrowDown('');
	 tick();
	 fixture.detectChanges();
	 expect(component.isSearching).toBeTrue();
	 expect(component.searchIndex()).toBe(0);
       }));

    it(`when a static source is present
        when the tagbar is searching
        when the escape key is preseed
        should hide the search`,
       fakeAsync( () => {
	 const de = fixture.debugElement;	 
	 const i = de.query(By.css('.tagbar--input')).nativeElement;
	 const searchTags = ['foo','bar','baz'];

	 component.source = searchTags;
	 component.isSearching = true;

	 fixture.detectChanges();

	 component.onEscape();
	 expect(component.isSearching).toBeFalse();
	 expect(component.searchIndex()).toBe(-1);
       }));

    it(`when a static source is present
        when the tagbar is searching
        when the input field loses focus
        should hide the search`,
       fakeAsync( () => {
	 const de = fixture.debugElement;	 
	 const i = de.query(By.css('.tagbar--input')).nativeElement;
	 const searchTags = ['foo','bar','baz'];

	 component.source = searchTags;
	 component.isSearching = true;

	 fixture.detectChanges();
	 expect(component.isSearching).toBeTrue();

	 component.onBlur('');
	 expect(component.isSearching).toBeFalse();
	 expect(i.value).toBe('');
       }));

    it(`when a static source is present
        when the tagbar is searching
        when a search item is clicked on
        should add the tag`,
       fakeAsync( () => {
	 const de = fixture.debugElement;	 
	 const i = de.query(By.css('.tagbar--input')).nativeElement;
	 const searchTags = ['foo','bar','baz'];

	 component.source = searchTags;
	 component.onFocus('');

	 tick();
	 
	 fixture.detectChanges();
	 expect(component.isSearching).toBeTrue();

	 const li = de.query(By.css('.tagbar--search-list-item'));
	 li.triggerEventHandler('mousedown','');
	 fixture.detectChanges();
	 
	 expect(component.tags).toContain('foo');
       }));

    it(`when a static source is present
        when the tagbar is searching
        when a search item is already selected using the keyboard
        when the mouse hovers over another item
        should highlight only the hovered item`,
       fakeAsync( () => {
	 const de = fixture.debugElement;	 
	 const i = de.query(By.css('.tagbar--input')).nativeElement;
	 const searchTags = ['foo','bar','baz'];

	 component.source = searchTags;
	 component.onFocus('');

	 tick();
	 
	 fixture.detectChanges();
	 expect(component.isSearching).toBeTrue();

	 const li = de.query(By.css('.tagbar--search-list-item-active'));
	 const otherLi = de.query(By.css('.tagbar--search-list-item-active+li'));

	 otherLi.triggerEventHandler('mouseover', '');
	 fixture.detectChanges();	 
	 
	 expect(li.classes['tagbar--search-list-item-active']).toBeFalsy();
	 expect(otherLi.classes['tagbar--search-list-item-active']).toBeTrue();

       }));

    it(`when a static source is present
        when the tagbar is searching
        when an element already exists in the tagbar
        should display as disabled`,
       fakeAsync( () => {
	 const de = fixture.debugElement;	 
	 const i = de.query(By.css('.tagbar--input')).nativeElement;
	 const searchTags = ['foo','bar','baz'];

	 component.source = searchTags;
	 component.onFocus('');
	 tick();
	 fixture.detectChanges();

	 const li = de.query(By.css('.tagbar--search-list-item-active'));
	 expect(li).toBeTruthy();
	 
	 component.addSearchItem('foo');
	 component.onFocus('');
	 tick();
	 fixture.detectChanges();

	 const sameLi = de.query(By.css('.tagbar--search-list-item-active'));
	 expect(sameLi.classes['tagbar--search-list-item-disabled']).toBeTruthy();
       }));
  });
});

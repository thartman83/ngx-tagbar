import { ComponentFixture, TestBed, tick, fakeAsync, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TagbarComponent } from './tagbar.component';
import { ListItemComponent } from './list-item/list-item.component'

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

      it(`should not add a tag if maxTags is set to 3 and there are 3 tags`,
         () => {
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

      it('should not remove a non-existant tag', () => {
        component = new TagbarComponent();
        component.tags = Object.assign([], initialTags);
        component.ngOnInit();

        let nonExistingTag = 'bob';
        component.removeTag(nonExistingTag);
        expect(component.tags.length).toBe(initialLen);
      });
    });

  });

  describe('functional tests', () => {
    let component: TagbarComponent;
    let fixture: ComponentFixture<TagbarComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [TagbarComponent, ListItemComponent],
        imports: [FormsModule]
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
      i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();

      expect(component.tags.length).toEqual(1);
      expect(component.tags).toContain(tagname);
      expect(component.inputTag).toBe('');
    });

    it('should add a tag when the input field has a value and it losses focus',
      fakeAsync(() => {
        const de = fixture.debugElement;
        const tagname = 'foobar';
        const i = de.query(By.css('.tagbar--input')).nativeElement;

        i.value = tagname;
        i.dispatchEvent(new Event('blur'));

        expect(component.tags.length).toEqual(1);
        expect(component.tags).toContain(tagname);

        fixture.detectChanges();
        expect(component.inputTag).toBe('');
      }));

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
        fakeAsync(() => {
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
        fakeAsync(() => {
          component.addTag('foo');
          component.addTag('bar');

          expect(component.tags.length).toEqual(2);

          const de = fixture.debugElement;
          const i = de.query(By.css('.tagbar--input')).nativeElement;

          // simulate a backspace message
          i.dispatchEvent(new KeyboardEvent('keydown', {
            "key": "Backspace"
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
         fakeAsync(() => {

          const de = fixture.debugElement;
          const i = de.query(By.css('.tagbar--input')).nativeElement;
          const searchTags = ['foo', 'bar', 'baz'];

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
          expect(de.queryAll(By.css('.tagbar--search-list-item')).length).toEqual(searchTags.length);
         }));

      it(`when a static source is present
          when limited is not set
          should add a tag not present in source list`,
         () => {
           const de = fixture.debugElement;
           const i = de.query(By.css('.tagbar--input')).nativeElement;
           const searchTags = ['foo', 'bar', 'baz'];

           component.source = searchTags;
           component.minimumInput = 0;
           component.limited = false;

           component.onFocus('');
           expect(component.tags.length).toEqual(0);
           expect(component.isSearching).toBeTrue();

           // blur change
           component.onBlur('googoo');
           fixture.detectChanges();

           expect(component.tags.length).toEqual(1);
           expect(component.tags).toContain('googoo');

           // enter key changes
           component.onFocus('');
           expect(component.isSearching).toBeTrue();

           // Add some characters
           i.dispatchEvent(new KeyboardEvent('keyup', {
            "key": "g"
           }));

           i.dispatchEvent(new KeyboardEvent('keyup', {
             "key": "o"
           }));

           i.dispatchEvent(new KeyboardEvent('keydown', {
            "key": "Enter"
           }));

           fixture.detectChanges();

           expect(component.tags.length).toEqual(2);
           expect(component.tags).not.toContain('go');
         });

      it(`when a static source is present
          when minimumInput is 1
          should not display the list when the input is focued`,
        fakeAsync(() => {
          const searchTags = ['foo', 'bar', 'baz'];

          component.source = searchTags;
          component.minimumInput = 1;
          expect(component.isSearching).toBeFalse();

          component.onFocus('');
          expect(component.isSearching).toBeFalse();
        }));

      it(`when a static source is present
          when minimumInput is 1
          should dipslay the list when the input has 1 character`,
        fakeAsync(() => {
          const de = fixture.debugElement;
          const i = de.query(By.css('.tagbar--input')).nativeElement;
          const searchTags = ['foo', 'bar', 'baz'];

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
          up and down arrows should highlight searchable values`,
        fakeAsync(() => {
          const de = fixture.debugElement;
          const i = de.query(By.css('.tagbar--input')).nativeElement;
          const searchTags = ['foo', 'bar', 'baz'];
          const focusedClass = '.tagbar--search-list-item-active'

          component.source = searchTags;

          component.isSearching = true;
          fixture.detectChanges();

          component.onFocus('');
          fixture.detectChanges();
          expect(de.query(By.css(focusedClass)).nativeElement.innerText).toEqual('foo');

          i.dispatchEvent(new KeyboardEvent('keydown', {
            "key": "ArrowDown"
          }));
          fixture.detectChanges();
          expect(de.query(By.css(focusedClass)).nativeElement.innerText).toEqual('bar');

          i.dispatchEvent(new KeyboardEvent('keydown', {
            "key": "ArrowDown"
          }));
          fixture.detectChanges();
          expect(de.query(By.css(focusedClass)).nativeElement.innerText).toEqual('baz');

          i.dispatchEvent(new KeyboardEvent('keydown', {
            "key": "ArrowUp"
          }));
          fixture.detectChanges();
          expect(de.query(By.css(focusedClass)).nativeElement.innerText).toEqual('bar');
        }));

      it(`when a static source is present
          when the tagbar is searching
          when the enter key is pressed 
          should select a hilighted search option`,
         fakeAsync(() => {
           const de = fixture.debugElement;
           const i = de.query(By.css('.tagbar--input')).nativeElement;
           const searchTags = ['foo', 'bar', 'baz'];

           component.source = searchTags;

           component.onFocus('');
           fixture.detectChanges();
           i.dispatchEvent(new KeyboardEvent('keydown', {
             "key": "Enter"
           }));
           fixture.detectChanges();

           expect(component.tags).toContain('foo');
           expect(component.isSearching).toBeFalse();
           expect(component.searchIndex()).toBe(-1);

           component.onFocus('');
           fixture.detectChanges();
           i.dispatchEvent(new KeyboardEvent('keydown', {
             "key": "ArrowDown"
           }));
           fixture.detectChanges();

           const li = de.query(By.css('.tagbar--search-list-item-active'));
           expect(li).toBeTruthy();
           expect(li.nativeElement.innerText).toEqual('bar');

           i.dispatchEvent(new KeyboardEvent('keydown', {
             "key": "Enter"
           }));
           fixture.detectChanges();

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
      fakeAsync(() => {
        const de = fixture.debugElement;
        const i = de.query(By.css('.tagbar--input')).nativeElement;
        const searchTags = ['foo', 'bar', 'baz'];

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
      fakeAsync(() => {
        const de = fixture.debugElement;
        const i = de.query(By.css('.tagbar--input')).nativeElement;
        const searchTags = ['foo', 'bar', 'baz'];

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
      fakeAsync(() => {
        const de = fixture.debugElement;
        const i = de.query(By.css('.tagbar--input')).nativeElement;
        const searchTags = ['foo', 'bar', 'baz'];

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
      fakeAsync(() => {
        const de = fixture.debugElement;
        const i = de.query(By.css('.tagbar--input')).nativeElement;
        const searchTags = ['foo', 'bar', 'baz'];

        component.source = searchTags;
        component.onFocus('');

        tick();

        fixture.detectChanges();
        expect(component.isSearching).toBeTrue();

        const li = de.query(By.css('.tagbar--search-list-item'));
        li.triggerEventHandler('mousedown', '');
        fixture.detectChanges();

        expect(component.tags).toContain('foo');
      }));

    it(`when a static source is present
        when the tagbar is searching
        when a search item is already selected using the keyboard
        when the mouse hovers over another item
        should highlight only the hovered item`,
      fakeAsync(() => {
        const de = fixture.debugElement;
        const i = de.query(By.css('.tagbar--input')).nativeElement;
        const searchTags = ['foo', 'bar', 'baz'];

        component.source = searchTags;
        component.onFocus('');

        tick();

        fixture.detectChanges();
        expect(component.isSearching).toBeTrue();

        const li = de.query(By.css('.tagbar--search-list-item-active'));
        expect(li.nativeElement.innerText).toEqual('foo');
        const otherLi = de.query(By.css('.tagbar--search-list-item:not(.tagbar--search-list-item-active)'));
        console.log(otherLi.nativeElement);
        expect(otherLi.nativeElement.innerText).toEqual('bar');

        otherLi.triggerEventHandler('mouseover', '');
        fixture.detectChanges();

        expect(li.classes['tagbar--search-list-item-active']).toBeFalsy();
        expect(otherLi.classes['tagbar--search-list-item-active']).toBeTrue();

      }));

    it(`when a static source is present
        when the tagbar is searching
        when an element already exists in the tagbar
        should display as selected`,
      fakeAsync(() => {
        const de = fixture.debugElement;
        const i = de.query(By.css('.tagbar--input')).nativeElement;
        const searchTags = ['foo', 'bar', 'baz'];

        component.source = searchTags;
        component.onFocus('');
        tick();
        fixture.detectChanges();

        const li = de.query(By.css('.tagbar--search-list-item-selected'));
        expect(li).toBeNull();

        component.addTag('foo');
        component.onFocus('');
        tick();
        fixture.detectChanges();

        expect(de.query(By.css('.tagbar--search-list-item-selected'))).toBeTruthy();
      }));

    it(`when a static source is present
        when the tagbar is searching
        when the letter 'b' is pressed
        should highlight the first search element with the letter b in it`,
       fakeAsync(() => {
         const de = fixture.debugElement;
         const i = de.query(By.css('.tagbar--input')).nativeElement;
         const searchTags = ['foo', 'bar', 'baz'];

         component.source = searchTags;

         component.onFocus('');
         component.onKeyUp(new KeyboardEvent('keyup', {
           "key": "b"
         }), 'b');

         fixture.detectChanges();

         const it = de.query(By.css('.tagbar--search-list-item-active'));
         expect(it.nativeElement.innerText).toEqual('bar');
       }));

    it(`when a function source is present
        when the tagbar is searching
        when minimum input is 0
        when the tag bar gets focus
        should display tags returned from source function`,
      fakeAsync(() => {

        const de = fixture.debugElement;
        const i = de.query(By.css('.tagbar--input')).nativeElement;

        component.source = (needle) => { return ['bob', 'bib', 'bub']; }
        component.onFocus('');
        fixture.detectChanges();

        expect(component.isSearching).toBeTrue();
      }));
    it(`when a function source is present
        when the source has more items that the search box can view
        when the arrow keys are used to search past the visible box
        selected item should scroll into view`,
       fakeAsync(() => {
         const de = fixture.debugElement;
         const i = de.query(By.css('.tagbar--input')).nativeElement;

         component.source = (needle) => { return ['bob','bib','bub', 'bird',
                                                  'bribe', 'bride', 'birdie',
                                                  'boabab']; }
         component.onFocus('');
         fixture.detectChanges();
         expect(component.isSearching).toBeTrue();

         for(let x = 0; x < 9; ++x) {
           i.dispatchEvent(new KeyboardEvent('keydown', {
             "key": "ArrowDown"
           }));
         }

         fixture.detectChanges();
         const li = de.query(By.css('.tagbar--search-list-item-active')).nativeElement;
         expect(li.innerText).toEqual('boabab');
         li.focus();
         li.scrollTo();
         console.log(li);
       }));

/*    it(`when an observable source is present
        when the minimum input is 0
        when the tag bar gets focus
        should display tags after the observable complets`,
       fakeAsync(() => {
         const de = fixture.debugElement;
         const i = de.query(By.css('.tagbar--input')).nativeElement;
         const data = ['bob', 'beb', 'bod'];

         component.source = of(data);

         component.onFocus('');
         fixture.detectChanges();
         expect(component.dataPending).toBeTrue();

         fixture.detectChanges();
         expect(component.isSearching).toBeTrue();
         expect(component.tags.length).toEqual(3);
         expect(component.tags).toContain('bob');
         expect(component.tags).toContain('beb');
         expect(component.tags).toContain('bod');

       }));*/
  });
});

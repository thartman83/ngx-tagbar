import { Testability } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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

        let newTag = '    ';
        component.addTag(newTag);
        expect(component.tags.length).toEqual(0);
      });

      it('should trim white space from the beginning and end of tags', () => {
        component = new TagbarComponent();
        component.ngOnInit();

        let newTag = '   foo   ';
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
  });
});

import { TagbarComponent } from './tagbar.component';

describe('TagbarComponent', () => {
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

      let existingTag = initialTags[0];
      component.addTag(existingTag);
      expect(component.tags.length).toBe(initialLen);
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

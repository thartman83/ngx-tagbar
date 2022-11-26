import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ListItemComponent } from './list-item.component';

describe('ListItemComponent', () => {
  let component: ListItemComponent;
  let fixture: ComponentFixture<ListItemComponent>;
  let de: any;
  let el: any;

  describe('::unit tests', () => {

    beforeEach(() => {
      fixture = TestBed.createComponent(ListItemComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      de = fixture.debugElement;
      el = de.query(By.css('li')).nativeElement;
    });

    it('should construct', () => {
      expect(component).toBeTruthy();

      expect(el.getAttribute('role')).toBe('option');
      expect(el.getAttribute('aria-current')).toEqual('false');
      expect(el.getAttribute('aria-selected')).toEqual('false');

      component.tagValue = 'foo';
      fixture.detectChanges();
      expect(el.innerText).toEqual('foo');
    });

    it('should set aria-current property when highlighted', () => {
      component.highlighted = true;

      fixture.detectChanges();

      expect(el.getAttribute('aria-current')).toEqual('true');
    });

    it('should set aria properties based on whether it is selected or not',
       () => {
         component.selected = true;

         fixture.detectChanges();

         expect(el.getAttribute('aria-selected')).toBe('true');
       });

    it(`when selected is true
        should set the li class to tagbar--search-list-item-selected`,
       () => {
         const de = fixture.debugElement;

         component.selected = true;
         fixture.detectChanges();

         const li = de.query(By.css('.tagbar--search-list-item'));
         expect(li.classes['tagbar--search-list-item-selected']).toBeTruthy();
       });

    it('should highlight onMouseEnter event', () => {
      component.onMouseEnter();
      fixture.detectChanges();

      expect(component.highlighted).toBeTrue();
      expect(el.getAttribute('aria-current')).toEqual('true');
    });

    it('should un-highlight onMouseLeave event', () => {
      component.onMouseLeave();
      fixture.detectChanges();

      expect(component.highlighted).toBeFalse();
      expect(el.getAttribute('aria-current')).toEqual('false');
    });

    it(`when the onMouseDown event is caught
        when the index is 2
        should emit event Selected with value 2`,
       () => {
         component.index = 2;

         fixture.detectChanges();

         spyOn(component.select,'emit');
         component.onMouseDown();

         expect(component.select.emit).toHaveBeenCalledTimes(1);
         expect(component.select.emit).toHaveBeenCalledWith(2);
       });
  });
});

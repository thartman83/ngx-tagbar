import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagbarComponent } from './tagbar.component';

describe('TagbarComponent', () => {
  let component: TagbarComponent;
  let fixture: ComponentFixture<TagbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

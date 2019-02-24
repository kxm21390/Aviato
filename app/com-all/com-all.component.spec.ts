import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComAllComponent } from './com-all.component';

describe('ComAllComponent', () => {
  let component: ComAllComponent;
  let fixture: ComponentFixture<ComAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

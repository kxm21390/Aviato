import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QTOptionsComponent } from './qtoptions.component';

describe('QTOptionsComponent', () => {
  let component: QTOptionsComponent;
  let fixture: ComponentFixture<QTOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QTOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QTOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

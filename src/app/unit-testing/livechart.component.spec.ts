import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivechartComponent } from '../dashboard/home/livechart/livechart.component';

describe('LivechartComponent', () => {
  let component: LivechartComponent;
  let fixture: ComponentFixture<LivechartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LivechartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LivechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

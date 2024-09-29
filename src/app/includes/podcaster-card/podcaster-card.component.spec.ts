import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcasterCardComponent } from './podcaster-card.component';

describe('PodcasterCardComponent', () => {
  let component: PodcasterCardComponent;
  let fixture: ComponentFixture<PodcasterCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PodcasterCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcasterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

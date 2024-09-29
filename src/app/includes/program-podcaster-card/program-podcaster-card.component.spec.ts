import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramPodcasterCardComponent } from './program-podcaster-card.component';

describe('ProgramPodcasterCardComponent', () => {
  let component: ProgramPodcasterCardComponent;
  let fixture: ComponentFixture<ProgramPodcasterCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramPodcasterCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramPodcasterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

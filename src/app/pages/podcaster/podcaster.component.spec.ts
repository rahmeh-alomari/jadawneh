import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcasterComponent } from './podcaster.component';

describe('PodcasterComponent', () => {
  let component: PodcasterComponent;
  let fixture: ComponentFixture<PodcasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PodcasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

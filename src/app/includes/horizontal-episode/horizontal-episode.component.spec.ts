import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalEpisodeComponent } from './horizontal-episode.component';

describe('HorizontalEpisodeComponent', () => {
  let component: HorizontalEpisodeComponent;
  let fixture: ComponentFixture<HorizontalEpisodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorizontalEpisodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalEpisodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalEpisodeComponent } from './vertical-episode.component';

describe('VerticalEpisodeComponent', () => {
  let component: VerticalEpisodeComponent;
  let fixture: ComponentFixture<VerticalEpisodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerticalEpisodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalEpisodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

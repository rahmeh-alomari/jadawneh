import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodePodcasterComponent } from './episode-podcaster.component';

describe('EpisodePodcasterComponent', () => {
  let component: EpisodePodcasterComponent;
  let fixture: ComponentFixture<EpisodePodcasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpisodePodcasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EpisodePodcasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastersComponent } from './podcasters.component';

describe('PodcastersComponent', () => {
  let component: PodcastersComponent;
  let fixture: ComponentFixture<PodcastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PodcastersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PodcastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalEposidePlayerComponent } from './vertical-eposide-player.component';

describe('VerticalEposidePlayerComponent', () => {
  let component: VerticalEposidePlayerComponent;
  let fixture: ComponentFixture<VerticalEposidePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerticalEposidePlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalEposidePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

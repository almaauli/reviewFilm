import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsProfileComponent } from './subs-profile.component';

describe('SubsProfileComponent', () => {
  let component: SubsProfileComponent;
  let fixture: ComponentFixture<SubsProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubsProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

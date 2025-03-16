import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutProfileComponent } from './aut-profile.component';

describe('AutProfileComponent', () => {
  let component: AutProfileComponent;
  let fixture: ComponentFixture<AutProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

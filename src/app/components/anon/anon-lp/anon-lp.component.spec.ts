import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonLpComponent } from './anon-lp.component';

describe('AnonLpComponent', () => {
  let component: AnonLpComponent;
  let fixture: ComponentFixture<AnonLpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnonLpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnonLpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

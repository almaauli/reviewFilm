import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutHomeComponent } from './aut-home.component';

describe('AutHomeComponent', () => {
  let component: AutHomeComponent;
  let fixture: ComponentFixture<AutHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

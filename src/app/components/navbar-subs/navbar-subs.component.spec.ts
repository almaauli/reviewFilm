import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarSubsComponent } from './navbar-subs.component';

describe('NavbarSubsComponent', () => {
  let component: NavbarSubsComponent;
  let fixture: ComponentFixture<NavbarSubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarSubsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarSubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

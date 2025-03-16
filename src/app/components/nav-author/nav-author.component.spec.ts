import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavAuthorComponent } from './nav-author.component';

describe('NavAuthorComponent', () => {
  let component: NavAuthorComponent;
  let fixture: ComponentFixture<NavAuthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavAuthorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

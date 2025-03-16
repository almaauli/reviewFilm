import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTgenreComponent } from './admin-tgenre.component';

describe('AdminTgenreComponent', () => {
  let component: AdminTgenreComponent;
  let fixture: ComponentFixture<AdminTgenreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTgenreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTgenreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

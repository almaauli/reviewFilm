import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTcomentComponent } from './admin-tcoment.component';

describe('AdminTcomentComponent', () => {
  let component: AdminTcomentComponent;
  let fixture: ComponentFixture<AdminTcomentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTcomentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTcomentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

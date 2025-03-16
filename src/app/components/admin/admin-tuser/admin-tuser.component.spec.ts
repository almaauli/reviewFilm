import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTuserComponent } from './admin-tuser.component';

describe('AdminTuserComponent', () => {
  let component: AdminTuserComponent;
  let fixture: ComponentFixture<AdminTuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTuserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

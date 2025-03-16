import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTtahunComponent } from './admin-ttahun.component';

describe('AdminTtahunComponent', () => {
  let component: AdminTtahunComponent;
  let fixture: ComponentFixture<AdminTtahunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTtahunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTtahunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

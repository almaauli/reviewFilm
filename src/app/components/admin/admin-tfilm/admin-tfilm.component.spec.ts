import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTfilmComponent } from './admin-tfilm.component';

describe('AdminTfilmComponent', () => {
  let component: AdminTfilmComponent;
  let fixture: ComponentFixture<AdminTfilmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTfilmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTfilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

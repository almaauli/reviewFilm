import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTnegaraComponent } from './admin-tnegara.component';

describe('AdminTnegaraComponent', () => {
  let component: AdminTnegaraComponent;
  let fixture: ComponentFixture<AdminTnegaraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTnegaraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTnegaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

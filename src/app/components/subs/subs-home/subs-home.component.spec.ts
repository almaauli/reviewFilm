import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsHomeComponent } from './subs-home.component';

describe('SubsHomeComponent', () => {
  let component: SubsHomeComponent;
  let fixture: ComponentFixture<SubsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubsHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

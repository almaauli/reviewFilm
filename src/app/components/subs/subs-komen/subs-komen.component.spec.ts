import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsKomenComponent } from './subs-komen.component';

describe('SubsKomenComponent', () => {
  let component: SubsKomenComponent;
  let fixture: ComponentFixture<SubsKomenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubsKomenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubsKomenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

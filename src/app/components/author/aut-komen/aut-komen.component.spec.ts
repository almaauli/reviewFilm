import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutKomenComponent } from './aut-komen.component';

describe('AutKomenComponent', () => {
  let component: AutKomenComponent;
  let fixture: ComponentFixture<AutKomenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutKomenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutKomenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

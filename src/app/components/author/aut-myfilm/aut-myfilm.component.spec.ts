import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutMyfilmComponent } from './aut-myfilm.component';

describe('AutMyfilmComponent', () => {
  let component: AutMyfilmComponent;
  let fixture: ComponentFixture<AutMyfilmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutMyfilmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutMyfilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

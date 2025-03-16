import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFilmautComponent } from './list-filmaut.component';

describe('ListFilmautComponent', () => {
  let component: ListFilmautComponent;
  let fixture: ComponentFixture<ListFilmautComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListFilmautComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFilmautComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

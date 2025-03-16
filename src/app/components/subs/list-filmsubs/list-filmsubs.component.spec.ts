import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFilmsubsComponent } from './list-filmsubs.component';

describe('ListFilmsubsComponent', () => {
  let component: ListFilmsubsComponent;
  let fixture: ComponentFixture<ListFilmsubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListFilmsubsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFilmsubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

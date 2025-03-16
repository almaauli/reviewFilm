import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFilmsubsComponent } from './detail-filmsubs.component';

describe('DetailFilmsubsComponent', () => {
  let component: DetailFilmsubsComponent;
  let fixture: ComponentFixture<DetailFilmsubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailFilmsubsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailFilmsubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

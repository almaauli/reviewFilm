import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFilmautComponent } from './detail-filmaut.component';

describe('DetailFilmautComponent', () => {
  let component: DetailFilmautComponent;
  let fixture: ComponentFixture<DetailFilmautComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailFilmautComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailFilmautComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

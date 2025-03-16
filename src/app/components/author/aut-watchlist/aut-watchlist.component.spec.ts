import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutWatchlistComponent } from './aut-watchlist.component';

describe('AutWatchlistComponent', () => {
  let component: AutWatchlistComponent;
  let fixture: ComponentFixture<AutWatchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutWatchlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutWatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

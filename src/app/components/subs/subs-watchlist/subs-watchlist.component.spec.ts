import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsWatchlistComponent } from './subs-watchlist.component';

describe('SubsWatchlistComponent', () => {
  let component: SubsWatchlistComponent;
  let fixture: ComponentFixture<SubsWatchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubsWatchlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubsWatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

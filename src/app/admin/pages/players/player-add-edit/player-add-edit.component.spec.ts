import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerAddEditComponent } from './player-add-edit.component';

describe('PlayerAddEditComponent', () => {
  let component: PlayerAddEditComponent;
  let fixture: ComponentFixture<PlayerAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

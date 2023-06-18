import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceShipComponent } from './space-ship.component';

describe('SpaceShipComponent', () => {
  let component: SpaceShipComponent;
  let fixture: ComponentFixture<SpaceShipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceShipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

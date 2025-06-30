import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryManagerLayoutComponent } from './delivery-manager-layout.component';

describe('DeliveryManagerLayoutComponent', () => {
  let component: DeliveryManagerLayoutComponent;
  let fixture: ComponentFixture<DeliveryManagerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryManagerLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryManagerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

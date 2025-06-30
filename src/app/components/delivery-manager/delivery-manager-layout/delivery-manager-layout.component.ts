import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { FooterComponent } from '../../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-delivery-manager-layout',
  imports: [NavbarComponent,
    FooterComponent,
    CommonModule,
    RouterModule
  ],
  templateUrl: './delivery-manager-layout.component.html',
  styleUrl: './delivery-manager-layout.component.scss'
})
export class DeliveryManagerLayoutComponent {

}

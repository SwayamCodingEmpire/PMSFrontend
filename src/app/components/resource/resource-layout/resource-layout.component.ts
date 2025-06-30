import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-resource-layout',
  imports: [NavbarComponent, FooterComponent,     CommonModule,
    RouterModule],
  templateUrl: './resource-layout.component.html',
  styleUrl: './resource-layout.component.scss'
})
export class ResourceLayoutComponent {

}

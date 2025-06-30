import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-manager-layout',
  imports: [NavbarComponent, FooterComponent,     CommonModule,
    RouterModule],
  templateUrl: './project-manager-layout.component.html',
  styleUrl: './project-manager-layout.component.scss'
})
export class ProjectManagerLayoutComponent {

}

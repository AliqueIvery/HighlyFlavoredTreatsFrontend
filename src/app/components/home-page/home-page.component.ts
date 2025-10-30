import { Component } from '@angular/core';
import { MAT_MENU_DEFAULT_OPTIONS, MatMenuDefaultOptions } from '@angular/material/menu';

const menuDefaults: MatMenuDefaultOptions = {
  overlayPanelClass: 'hft-menu-overlay',
  xPosition: 'before',
  yPosition: 'above',
  overlapTrigger: false,
  backdropClass: ''
};

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers : [
    { provide: MAT_MENU_DEFAULT_OPTIONS, useValue: menuDefaults }
  ]
})
export class HomePageComponent {

}

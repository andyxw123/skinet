import { Component, OnInit, isDevMode } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  isDevMode = false;

  constructor() { }

  ngOnInit(): void {
    this.isDevMode = isDevMode();
  }

}

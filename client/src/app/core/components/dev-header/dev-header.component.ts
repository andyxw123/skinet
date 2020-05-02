import { Component, OnInit, isDevMode } from '@angular/core';

@Component({
  selector: 'app-dev-header',
  templateUrl: './dev-header.component.html',
  styleUrls: ['./dev-header.component.scss']
})
export class DevHeaderComponent implements OnInit {
  isDevMode = false;

  constructor() { }

  ngOnInit(): void {
    this.isDevMode = isDevMode();
  }

}

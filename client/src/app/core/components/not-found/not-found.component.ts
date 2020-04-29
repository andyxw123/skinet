import { Component, OnInit, isDevMode } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  isDevMode: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isDevMode = isDevMode();
  }
}

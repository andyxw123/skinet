import { Component, OnInit, isDevMode } from '@angular/core';
import { IApiException } from 'src/app/shared/models/i-api-exception';
import { ClipboardService } from 'ngx-clipboard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss'],
})
export class ServerErrorComponent implements OnInit {
  isDevMode: boolean;
  apiExceptions: IApiException[] = [];

  constructor(
    private clipboardService: ClipboardService,
    private router: Router
  ) {
    // Retrieve the error object (navigation extras are only accessible in the constructor)
    const navigation = this.router.getCurrentNavigation();

    if (navigation && navigation.extras && navigation.extras.state && navigation.extras.state.apiException) {
      this.apiExceptions.push(navigation.extras.state.apiException);
    }
  }

  ngOnInit(): void {
    this.isDevMode = isDevMode();
  }

  copyException(exception: IApiException) {
    if (exception) {
      this.clipboardService.copy([exception.message || '', exception.details || ''].join('\n'));
    }
  }
}

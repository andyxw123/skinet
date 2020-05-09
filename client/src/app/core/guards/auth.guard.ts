import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanLoad,
  CanActivateChild,
  ActivatedRoute,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Subscribe to the currentUser$ observable so the Guard waits until this value has changed
    // (for example after the current user has been retrieved from the API)
    // Note that currentUser uses a ReplaySubject as this doesn't emit the initial value like
    // the BehaviorSubject does
    return this.accountService.currentUser$.pipe(
      map((currentUser) => {
        if (currentUser) {
          return true;
        } else {
          this.router.navigate(['/account/login'], {
            queryParams: {
              return: state?.url,
            },
          });
          return false;
        }
      })
    );
  }
}

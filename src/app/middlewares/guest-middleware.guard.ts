import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild, CanLoad, Router, UrlSegment } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { LocaleService } from '../services/locale.service';
import { Locale } from '../types';

@Injectable({
	providedIn: 'root'
})
export class GuestMiddlewareGuard implements CanActivate, CanActivateChild, CanLoad 
{
	/**
	* Constructor
	*
	* @param {AuthService} authService
	* @param {Router} router
	*/
	constructor(
		private authService   : AuthService,
		private localeService : LocaleService,
		private router		  : Router,
	) {
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Private methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Check the authenticated status
	 *
	 * @private
	 */
	private _check(): Observable<boolean> {
		return this.authService.check$
		.pipe(
			switchMap((authenticated) => {
				if (authenticated) {
					this.localeService.locale$
					.pipe(take(1))
					.subscribe((locale: Locale) => {
						this.router.navigate(['/', locale.prefix, 'home']);
					});
					// Prevent the access
					return of(false);
				}
				return of(true);
			})
		);
	}

	/**
	 * Can activate
	 *
	 * @param route
	 * @param state
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		return this._check();
	}

	/**
	 * Can activate child
	 *
	 * @param childRoute
	 * @param state
	 */
	canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this._check();
	}

	/**
	 * Can load
	 *
	 * @param route
	 * @param segments
	 */
	canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
		return this._check();
	}
}
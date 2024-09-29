import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
    HttpErrorResponse,
    HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, tap } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
import { environment } from 'src/environments/environment';

@Injectable()

export class AuthInterceptor implements HttpInterceptor
{
    public execludeFromLoader = {};

	/**
     * Constructor
     *
     * @param {AuthService} authService
     */
	 constructor(
        private authService   : AuthService,
        private loaderService : LoaderService
    )
    {
        this.execludeFromLoader[ environment.apiBaseUrl + '/episodes/toggle_favorite' ]     = true;
        this.execludeFromLoader[ environment.apiBaseUrl + '/programs/toggle_favorite' ]     = true;
        this.execludeFromLoader[ environment.apiBaseUrl + '/broadcasters/toggle_favorite' ] = true;
        this.execludeFromLoader[ environment.apiBaseUrl + '/episodes/mark_listened_to' ]    = true;
        this.execludeFromLoader[ environment.apiBaseUrl + '/episodes/mark_listened_to' ]    = true;
    }

    /**
     * Intercept
     *
     * @param req
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        // Clone the request object
        let newReq = req.clone();

        if ( this.authService.tokenSync ) {
            newReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + this.authService.tokenSync)
            });
        }

        if (this.shouldShowLoader(newReq)) {
            this.loaderService.loading();
        }

        // Response
        return next.handle(newReq)
		.pipe(
            tap((evt) => {
                if (evt instanceof HttpResponse) {
                    if (evt.body.code == '000001') {
                        this.authService.logout();
                        location.reload();
                    }
                    if (evt.body.code == '000002') {
                        this.authService.logout();
                        location.reload();
                    }
                    if (this.shouldShowLoader(newReq)) {
                        this.loaderService.completed();
                    }
                }
            }),
            catchError((error) => {
                if ( error instanceof HttpErrorResponse && error.status === 401 ) {
                    this.authService.logout();
                    location.reload();
                }
                return throwError(error);
            })
        );
    }

    shouldShowLoader(newReq: HttpRequest<any>): boolean
    {
        return this.execludeFromLoader[newReq.url] ? false : true;
    }
}

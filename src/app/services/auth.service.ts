import { Injectable } from '@angular/core';
import { SocialLoginService } from 'ngx-social-login';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../types';

@Injectable({
	providedIn: 'root'
})
export class AuthService 
{
	private _user       : BehaviorSubject<User | null>;

	private _isLoggedIn : BehaviorSubject<boolean>;
	
	private _token      : BehaviorSubject<string | null>;

	public  tokenSync   : string | null;

	constructor(
		private socialLoginService : SocialLoginService
	) 
	{ 
		let _user        = this.getFromLocalStorage() || null;
		this._user       = new BehaviorSubject( _user );
		this._isLoggedIn = new BehaviorSubject( _user ? true : false );
		this._token      = new BehaviorSubject( this.getTokenFromLocalStorage() );
		this.tokenSync   = this.getTokenFromLocalStorage();
	}

	protected getFromLocalStorage() : User | null
	{
		if (localStorage.hasOwnProperty('user')) {
			return JSON.parse(localStorage.getItem('user') || '{}');
		}
		return null;
	}

	protected getTokenFromLocalStorage() : string | null
	{
		if (localStorage.hasOwnProperty('token')) {
			return localStorage.getItem('token');
		}
		return null;
	}

	set user(user: User) 
	{
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
			if (user.token) {
				this.token = user.token;
				this._isLoggedIn.next(true);
			}
			this._user.next( user );
		}
	}

	set token(token: string | null) 
	{
		if (token) {
			localStorage.setItem('token', token);
			this._token.next( token );
			this.tokenSync = token;
		}
	}

	get user$() : Observable<User | null> 
	{
		return this._user.asObservable();
	}

	get token$() : Observable<string | null> 
	{
		return this._token.asObservable();
	}

	get check$() : Observable<boolean> 
	{
		return this._isLoggedIn.asObservable();
	}

	logout()
	{
		this.socialLoginService.logout().subscribe({
			complete : ()  => console.log('Logout success'),
			error    : err => console.log(err)
		});
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		this.tokenSync = null;
		this._user.next( null );
		this._isLoggedIn.next( false );
		this._token.next( null );
	}
}

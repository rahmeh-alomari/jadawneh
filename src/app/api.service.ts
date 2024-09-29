import { Injectable } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})

export class ApiService
{
	constructor(
		private http   	    : HttpClient,
		private router 	    : Router,
		private serializer  : UrlSerializer
	)
	{
	}

	private buildUrlString(data?: any)
	{
		data           = ! data      ? {} : data;
		data.page      = ! data.page ? 1  : data.page;
		let params = this.router.createUrlTree([''], { queryParams: data });
		return this.serializer.serialize(params).substring(1);
	}

	signinUsingSocialMedia(locale: string, data?: any) : Observable<any>
	{
		return this.http.post( environment.apiBaseUrl + '/auth/login_via_social_media', data, {
		  	headers: { locale : locale }
		});
	}

	signin(locale: string, data?: any) : Observable<any>
	{
		return this.http.post( environment.apiBaseUrl + '/auth/login', data, {
		  	headers: { locale : locale }
		});
	}

	signout(locale: string, data?: any) : Observable<any>
	{
		return this.http.post( environment.apiBaseUrl + '/auth/logout', data, {
		  	headers: { locale : locale }
		});
	}

	signup(locale: string, data?: any) : Observable<any>
	{
		return this.http.post( environment.apiBaseUrl + '/auth/register', data, {
		  	headers: { locale : locale }
		});
	}

	updateProfile(locale: string, data?: any) : Observable<any>
	{
		return this.http.post( environment.apiBaseUrl + '/auth/update_account', data, {
		  	headers: { locale : locale }
		});
	}

	updateProfilePassword(locale: string, data?: any) : Observable<any>
	{
		return this.http.post( environment.apiBaseUrl + '/auth/password/reset_with_old', data, {
		  	headers: { locale : locale }
		});
	}

	favorites(locale: string, data?: any) : Observable<any>
	{
		return this.http.get( environment.apiBaseUrl + '/favorites' + this.buildUrlString(data), {
		  	headers: { locale : locale }
		});
	}

	contactUs(locale: string, data?: any) : Observable<any>
	{
		return this.http.post( environment.apiBaseUrl + '/messages/send_web', data, {
		  	headers: { locale : locale }
		});
	}

	toggleEpisodeFavorite(locale: string, data?: any) : Observable<any>
	{
		return this.http.post( environment.apiBaseUrl + '/episodes/toggle_favorite', data, {
		  	headers: { locale : locale }
		});
	}

	toggleProgrameFavorite(locale: string, data?: any) : Observable<any>
	{
		return this.http.post( environment.apiBaseUrl + '/programs/toggle_favorite', data, {
		  	headers: { locale : locale }
		});
	}

	togglePodcasterFavorite(locale: string, data?: any) : Observable<any>
	{
		return this.http.post( environment.apiBaseUrl + '/broadcasters/toggle_favorite', data, {
		  	headers: { locale : locale }
		});
	}

	touchEpisode(locale: string, data?: any) : Observable<any>
	{
		return this.http.post( environment.apiBaseUrl + '/episodes/mark_listened_to', data, {
		  	headers: { locale : locale }
		});
	}

	markEpisodePlayed(locale: string, data?: any) : Observable<any>
	{
		return this.http.post( environment.apiBaseUrl + '/episodes/mark_played', data, {
		  	headers: { locale : locale }
		});
	}

	subscribeToNewsletter(locale: string, data?: any) : Observable<any>
	{
		return this.http.post( environment.apiBaseUrl + '/email_subscriptions/store', data, {
		  	headers: { locale : locale }
		});
	}

	config(locale: string, data?: any) : Observable<any>
	{
		return this.http.get( environment.apiBaseUrl + '/configs' + this.buildUrlString(data), {
		  	headers: { locale : locale }
		});
	}

	categories(locale: string, data?: any) : Observable<any>
	{
		return this.http.get( environment.apiBaseUrl + '/categories' + this.buildUrlString(data), {
		  	headers: { locale : locale }
		});
	}

	category(locale: string, data?: any) : Observable<any>
	{
		return this.http.get( environment.apiBaseUrl + '/categories/details' + this.buildUrlString(data), {
		  	headers: { locale : locale }
		});
	}

	programs(locale: string, data?: any) : Observable<any>
	{
		return this.http.get( environment.apiBaseUrl + '/programs' + this.buildUrlString(data), {
		  	headers: { locale : locale }
		});
	}


	getPopularData(locale: string): Observable<any[]> {
		console.log("Fetching popular data for locale:", locale);
		
		return this.http.get<any>(`${environment.apiBaseUrl}/home/popular`, {
		  headers: { locale: locale }
		}).pipe(
		  map(response => this.transformResponse(response)),
		  catchError(error => {
			console.error('Error fetching popular data:', error);
			throw error; // Rethrow the error for the component to handle
		  })
		);
	  }
	
	  private transformResponse(response: any): any[] {
		if (response?.result?.most_listened) {
		  return response.result.most_listened.map(item => ({
			episodeId: item.episode_id,
			title: item.title || '', // Fallback in case title is missing
			description: item.description || '',
			imageUrl: item.image || '',
			favoredBy: item.favored_by || 0,
			broadcaster: {
			  broadcasterId: item.broadcaster?.broadcaster_id || 0,
			  title: item.broadcaster?.title || '',
			},
			shareUrl: item.share || ''
		  }));
		} else {
		  return [];
		}
	  }
	  
	  getMostListenedData(locale: string): Observable<any> {
		return this.http.get<any>(`${environment.apiBaseUrl}/home/mostLisitend`, {
			headers: { locale: locale }
		  }).pipe(
			map(response => this.transformResponse(response)),
			catchError(error => {
			  console.error('Error fetching popular data:', error);
			  throw error; // Rethrow the error for the component to handle
			})
		  );
		}



		getPodcastersData(locale: string, page: number): Observable<any> {
			return this.http.get<any>(`${environment.apiBaseUrl}/home/bodcaster`, {
			  headers: { locale: locale },
			  params: { page: page.toString() } // Include page parameter in the request
			}).pipe(
			  tap(response => {
				console.log("Response:", response);
			  }),
			  catchError(error => {
				console.error('Error fetching podcasters data:', error);
				throw error; // Rethrow the error for the component to handle
			  })
			);
		  }
		  getexploreData(locale: string, page: number): Observable<any> {
			return this.http.get<any>(`${environment.apiBaseUrl}/home/explore`, {
			  headers: { locale: locale },
			  params: { page: page.toString() }
			}).pipe(
			  tap(response => {
				console.log("response", response);
			  }),
			  catchError(error => {
				console.error('Error fetching popular data:', error);
				throw error; // Rethrow the error for the component to handle
			  })
			);
		  }


	program(locale: string, data?: any) : Observable<any>
	{
		return this.http.get( environment.apiBaseUrl + '/programs/details' + this.buildUrlString(data), {
		  	headers: { locale : locale }
		});
	}

	home(locale: string, data?: any) : Observable<any>
	{
		return this.http.get( environment.apiBaseUrl + '/home' + this.buildUrlString(data), {
		  	headers: {locale : locale}
		});
	}

	search(locale: string, data?: any) : Observable<any>
	{
		return this.http.get( environment.apiBaseUrl + '/search' + this.buildUrlString(data), {
		  	headers: {locale : locale}
		});
	}

	episode(locale: string, data?: any) : Observable<any>
	{
		console.log("datadata",data)
		return this.http.get( environment.apiBaseUrl + '/programs/episodes/details' + this.buildUrlString(data), {
			
		  	headers: {locale : locale}
		});
	}

	podcaster(locale: string, data?: any) : Observable<any>
	{
		return this.http.get( environment.apiBaseUrl + '/broadcasters/details' + this.buildUrlString(data), {
		  	headers: { locale : locale }
		});
	}

  blog(locale: string, data?: any) : Observable<any>
	{
		return this.http.get( environment.apiBaseUrl + '/rss/indexBlog' + this.buildUrlString(data), {
		  	headers: { locale : locale }
		});
	}

	page(locale: string, data?: any) : Observable<any>
	{
		// type=pages
		return this.http.get( environment.apiBaseUrl + '/contents' + this.buildUrlString(data), {
		  	headers: { locale : locale }
		});
	}

	footer(locale: string, data?: any) : Observable<any>
	{
		return this.http.get( environment.apiBaseUrl + '/home/footer' + this.buildUrlString(data), {
		  	headers: { locale : locale }
		});
	}

	uploadRecording(locale: string, data?: any) : Observable<any>
	{
		return this.http.post( environment.apiBaseUrl + '/messages/send-voice', data, {
		  	headers: { locale : locale }
		});
	}



}

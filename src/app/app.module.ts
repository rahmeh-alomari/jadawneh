import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalComponent } from './global/global.component';

import { LayoutComponent } from './layout/layout.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ProgramsComponent } from './pages/programs/programs.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { EpisodeComponent } from './pages/episode/episode.component';
import { PodcasterComponent } from './pages/podcaster/podcaster.component';
import { CategoryComponent } from './pages/category/category.component';
import { HorizontalEpisodeComponent } from './includes/horizontal-episode/horizontal-episode.component';
import { VerticalEpisodeComponent } from './includes/vertical-episode/vertical-episode.component';
import { ProgramComponent } from './pages/program/program.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileUpdateComponent } from './pages/profile-update/profile-update.component';
import { PasswordUpdateComponent } from './pages/password-update/password-update.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { VimeModule } from '@vime/angular';
import { PlayerComponent } from './includes/player/player.component';
import { CategoryCardComponent } from './includes/category-card/category-card.component';
import { ProgramCardComponent } from './includes/program-card/program-card.component';
import { PodcasterCardComponent } from './includes/podcaster-card/podcaster-card.component';
import { EpisodesTableComponent } from './includes/episodes-table/episodes-table.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { ApiService } from './api.service';
import { LocaleService } from './services/locale.service';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './middlewares/auth.interceptor';
import { NgxSocialLoginModule, SocialLoginService } from 'ngx-social-login';
import { SearchComponent } from './pages/search/search.component';
import { environment } from 'src/environments/environment';
import { StaticPlayerService } from './includes/static-player.service';
import { MiniPlayerComponent } from './includes/mini-player/mini-player.component';
import { NgAudioRecorderModule } from 'ng-audio-recorder';
import { RecordingComponent } from './pages/recording/recording.component';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { RedirectComponent } from './pages/redirect/redirect.component';
import { OurServicesComponent } from './pages/our-services/our-services.component';
import { MostRecentComponent } from './pages/most-recent/most-recent.component';
import { MostPopularComponent } from './pages/most-popular/most-popular.component';
import { PodcastersComponent } from './pages/podcasters/podcasters.component';
import { EpisodePodcasterComponent } from './includes/episode-podcaster/episode-podcaster.component';
import { ProgramPodcasterCardComponent } from './includes/program-podcaster-card/program-podcaster-card.component';
import { VerticalEposidePlayerComponent } from './includes/vertical-eposide-player/vertical-eposide-player.component';
import { ValidateInputDirectiveDirective } from './directive/validate-input-directive.directive';
import { DynamicMetaDirective } from './directive/dynamic-meta.directive';
import { SitemapComponent } from './sitemap/sitemap.component';

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
	declarations: [
		AppComponent,
		GlobalComponent,
		LayoutComponent,
		HomeComponent,
		CategoriesComponent,
		ContactUsComponent,
		ProgramsComponent,
		AboutUsComponent,
		EpisodeComponent,
		PodcasterComponent,
		CategoryComponent,
		HorizontalEpisodeComponent,
		VerticalEpisodeComponent,
		ProgramComponent,
		SigninComponent,
		SignupComponent,
		ProfileUpdateComponent,
		PasswordUpdateComponent,
		FavoriteComponent,
		PlayerComponent,
		CategoryCardComponent,
		ProgramCardComponent,
		PodcasterCardComponent,
		EpisodesTableComponent,
		AuthLayoutComponent,
		SearchComponent,
		MiniPlayerComponent,
		RecordingComponent,
		BlogsComponent,
    OurServicesComponent,
		RedirectComponent,
		OurServicesComponent,
		MostRecentComponent,
		MostPopularComponent,
		PodcastersComponent,
		EpisodePodcasterComponent,
		ProgramPodcasterCardComponent,
		VerticalEposidePlayerComponent,
		ValidateInputDirectiveDirective,
		DynamicMetaDirective,
		SitemapComponent
	],
	imports: [
		CommonModule,
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		VimeModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		NgxSocialLoginModule.init({
			google: {
				client_id: environment.socialAuth.googleAppID
			},
			facebook: {
				initOptions: {
					appId: environment.socialAuth.facebookAppID
				}
			}
		}),
		BrowserAnimationsModule,
		ToastrModule.forRoot(),
		NgAudioRecorderModule
	],
	providers: [
		{provide : LocationStrategy , useClass: HashLocationStrategy},
		ApiService,
		LocaleService,
		AuthService,
		StaticPlayerService,
		SocialLoginService,

		{
            provide : HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi   : true
        }
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }

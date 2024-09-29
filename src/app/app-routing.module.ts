import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { BaseResolver } from './base.resolver';
import { GlobalComponent } from './global/global.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthMiddlewareGuard } from './middlewares/auth-middleware.guard';
import { GuestMiddlewareGuard } from './middlewares/guest-middleware.guard';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryComponent } from './pages/category/category.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { EpisodeComponent } from './pages/episode/episode.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { HomeComponent } from './pages/home/home.component';
import { PasswordUpdateComponent } from './pages/password-update/password-update.component';
import { PodcasterComponent } from './pages/podcaster/podcaster.component';
import { ProfileUpdateComponent } from './pages/profile-update/profile-update.component';
import { ProgramComponent } from './pages/program/program.component';
import { ProgramsComponent } from './pages/programs/programs.component';
import { RecordingComponent } from './pages/recording/recording.component';
import { SearchComponent } from './pages/search/search.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { RedirectComponent } from './pages/redirect/redirect.component';
import { OurServicesComponent } from './pages/our-services/our-services.component';
import { MostRecentComponent } from './pages/most-recent/most-recent.component';
import { MostPopularComponent } from './pages/most-popular/most-popular.component';
import { PodcastersComponent } from './pages/podcasters/podcasters.component';
import { SitemapComponent } from './sitemap/sitemap.component';

const routerConfig: ExtraOptions = {
	scrollPositionRestoration: 'enabled',
	relativeLinkResolution: 'legacy',
};

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: environment.locale
	},
	
	{
		path: ':locale',
		resolve: {
			GlobalData: BaseResolver,
		},
		component: GlobalComponent,
		children: [
			{
				path: '',
				component: LayoutComponent,
				data: { activeMenu: 'home' },
				children: [
					{
						path: 'Site-map',
						component: SitemapComponent,
						children: [],
					},
					{
						path: '',
						pathMatch: 'full',
						redirectTo: 'home'
					},
					{
						path: 'Most-Recent',
						component: MostRecentComponent,
						
					},


					{
						path: 'Most-Popular',
						component: MostPopularComponent,
						
					},

					{
						path: 'Podcasters',
						component: PodcastersComponent,
						
					},
				
					{
						path: 'home',
						component: HomeComponent,
						data: { activeMenu: 'home' },
						children: [],
					},
					{
						path: 'search/:keyword',
						component: SearchComponent,
						data: { activeMenu: 'search' },
						children: [],
					},
					
          {
            path: 'download',
            component: RedirectComponent
          },
	
					{
						path: 'programs',
						component: ProgramsComponent,
						data: { activeMenu: 'programs' },
						children: [],
					},
					{
						path: 'program/:id',
						component: ProgramComponent,
						data: { activeMenu: 'programs' },
						children: [],
					},
					{
						path: 'categories',
						component: CategoriesComponent,
						data: { activeMenu: 'categories' },
						children: [],
					},
					{
						path: 'category/:id',
						component: CategoryComponent,
						data: { activeMenu: 'categories' },
						children: [],
					},
					{
						path: 'podcaster/:id',
						component: PodcasterComponent,
						data: { activeMenu: 'podcaster' },
						children: [],
					},
					{
						path: 'episode/:id',
						component: EpisodeComponent,
						data: { activeMenu: 'programs' },
						children: [],
					},
					{
						path: 'about-us',
						component: AboutUsComponent,
						data: { activeMenu: 'about-us' },
						children: [],
					},
					{
						path: 'contact-us',
						component: ContactUsComponent,
						data: { activeMenu: 'contact-us' },
						children: [],
					},
					{
						path: 'blogs',
						component: BlogsComponent,
						data: { activeMenu: 'blogs' },
						children: [],
					},
          {
						path: 'OurService',
						component: OurServicesComponent,
						data: { activeMenu: 'OurService' },
						children: [],
					},

					{
						path: 'send-recording',
						canActivate: [AuthMiddlewareGuard],
						canActivateChild: [AuthMiddlewareGuard],
						component: RecordingComponent,
						data: { activeMenu: 'send-recording' },
						children: [],
					},
					{
						path: 'profile',
						canActivate: [AuthMiddlewareGuard],
						canActivateChild: [AuthMiddlewareGuard],
						component: AuthLayoutComponent,
						data: { activeMenu: 'profile' },
						children: [
							{
								path: '',
								component: ProfileUpdateComponent,
								data: { activeMenu: 'profile' },
								children: [],
							},
							{
								path: 'security',
								component: PasswordUpdateComponent,
								data: { activeMenu: 'profile' },
								children: [],
							},
							{
								path: 'favorite',
								component: FavoriteComponent,
								data: { activeMenu: 'profile' },
								children: [],
							},
						]
					},
				],
			},
			{
				path: 'account',
				component: LayoutComponent,
				canActivate: [GuestMiddlewareGuard],
				canActivateChild: [GuestMiddlewareGuard],
				// component: AuthLayoutComponent,
				children: [
					{
						path: 'sign-in',
						component: SigninComponent,
						children: [],
					},
					{
						path: 'sign-up',
						component: SignupComponent,
						children: [],
					},
				]
			},
		]
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, routerConfig)
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule { }

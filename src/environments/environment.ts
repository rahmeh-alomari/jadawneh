// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {

	production 		 : false,

		apiBaseUrl       : 'https://backend.podqasti.com/api/v1',
    // apiBaseUrl       : 'http://127.0.0.1:8000/api/v1/',

	locale     	     : 'ar',

	availableLocales : [
		{
			prefix    : 'ar',
			name      : 'Arabic',
			direction : 'rtl',
		},
		{
			prefix    : 'en',
			name      : 'English',
			direction : 'ltr',
		}
	],

	socialAuth: {
		facebookAppID : '486214652502464',
		googleAppID   : '163241134643-4f1pqmtnf8r51iq93gt7sefeh098d3q1.apps.googleusercontent.com',
	},
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

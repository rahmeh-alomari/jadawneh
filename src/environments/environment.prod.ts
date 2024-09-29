export const environment = {

	production 		 : true,

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

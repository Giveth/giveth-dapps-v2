export const regexList = {
	email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	url: /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
	twitter:
		/(?:https?:)?\/\/(?:www\.|m\.)?twitter\.com\/(\w{2,15})\/?(?:\?\S+)?(?:\#\S+)?$/,
	facebook:
		/(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/,
	instagram:
		/(?:https?:)?\/\/(?:www\.|m\.)?instagram\.com\/(\w{2,15})\/?(?:\?\S+)?(?:\#\S+)?$/,
	linkedIn: /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)/,
	youtube:
		/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
};

export const validators = {
	tooShort: {
		pattern: {
			value: 3,
			message: 'Too Short',
		},
	},
	email: {
		pattern: {
			value: regexList.email,
			message: 'Invalid Email Address',
		},
	},
	url: {
		pattern: {
			value: regexList.url,
			message: 'Invalid URL',
		},
	},
	twitter: {
		pattern: {
			value: regexList.twitter,
			message: 'Invalid twitter URL',
		},
	},
	facebook: {
		pattern: {
			value: regexList.facebook,
			message: 'Invalid facebook URL',
		},
	},
	linkedIn: {
		pattern: {
			value: regexList.linkedIn,
			message: 'Invalid linkedIn URL',
		},
	},
	instagram: {
		pattern: {
			value: regexList.instagram,
			message: 'Invalid instagram URL',
		},
	},
	youtube: {
		pattern: {
			value: regexList.youtube,
			message: 'Invalid youtube URL',
		},
	},
};

export const requiredOptions = {
	email: {
		required: {
			value: true,
			message: 'Email is required',
		},
		...validators.email,
	},
	lastName: {
		required: {
			value: true,
			message: 'Last name is required',
		},
	},
	firstName: {
		required: {
			value: true,
			message: 'First name is required',
		},
	},
	url: {
		required: {
			value: true,
			message: 'Url is required',
		},
		...validators.url,
	},
};

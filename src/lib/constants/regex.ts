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
	tooShort: { value: 3, message: 'Too Short' },
	email: {
		value: regexList.email,
		message: 'Invalid Email Address',
	},
	url: {
		value: regexList.url,
		message: 'Invalid URL',
	},
	twitter: {
		value: regexList.twitter,
		message: 'Invalid twitter URL',
	},
	facebook: {
		value: regexList.facebook,
		message: 'Invalid facebook URL',
	},
	linkedIn: {
		value: regexList.linkedIn,
		message: 'Invalid linkedIn URL',
	},
	instagram: {
		value: regexList.instagram,
		message: 'Invalid instagram URL',
	},
	youtube: {
		value: regexList.youtube,
		message: 'Invalid youtube URL',
	},
};

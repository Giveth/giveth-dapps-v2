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
	tooShort: /^.{3,}$/,
};

export const validators = {
	tooShort: { pattern: regexList.tooShort, msg: 'Too Short' },
	email: {
		pattern: regexList.email,
		msg: 'Invalid Email Address',
	},
	url: {
		pattern: regexList.url,
		msg: 'Invalid URL',
	},
	twitter: {
		pattern: regexList.twitter,
		msg: 'Invalid twitter URL',
	},
	facebook: {
		pattern: regexList.facebook,
		msg: 'Invalid facebook URL',
	},
	linkedIn: {
		pattern: regexList.linkedIn,
		msg: 'Invalid linkedIn URL',
	},
	instagram: {
		pattern: regexList.instagram,
		msg: 'Invalid instagram URL',
	},
	youtube: {
		pattern: regexList.youtube,
		msg: 'Invalid youtube URL',
	},
};

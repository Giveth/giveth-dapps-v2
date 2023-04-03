export const regexList = {
	email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	website:
		/^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
	twitter:
		/(?:https?:)?\/\/(?:www\.|m\.)?twitter\.com\/(\w{2,15})\/?(?:\?\S+)?(?:\#\S+)?$/,
	facebook:
		/(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/,
	instagram:
		/(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/,
	linkedin: /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)/,
	youtube: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
	tooShort: /^.{3,}$/,
};

export const validators = {
	tooShort: {
		pattern: {
			value: regexList.tooShort,
			message: 'Too Short',
		},
	},
	email: {
		pattern: {
			value: regexList.email,
			message: 'Invalid Email Address',
		},
	},
	website: {
		pattern: {
			value: regexList.website,
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
	linkedin: {
		pattern: {
			value: regexList.linkedin,
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
	name: {
		required: {
			value: true,
			message: 'Name is required',
		},
	},
	website: {
		required: {
			value: true,
			message: 'Url is required',
		},
		...validators.website,
	},
	field: {
		required: {
			value: true,
			message: 'This field is required',
		},
	},
	date: {
		required: {
			value: true,
			message: 'Date is required',
		},
	},
	title: {
		required: {
			value: true,
			message: 'Title is required',
		},
	},
	walletAddress: {
		required: {
			value: true,
			message: 'Wallet address is required',
		},
	},
};

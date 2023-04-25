export enum EContentType {
	thisProject = 'thisProject',
	ourProject = 'ourProject',
	justDonated = 'justDonated',
}

export enum ESocialType {
	twitter = 'twitter',
	facebook = 'facebook',
	linkedin = 'linkedin',
}

export const shareContentCreator = (
	contentType: EContentType,
	socialType: ESocialType,
) => {
	const socialHandle =
		socialType === ESocialType.twitter ? '@Giveth' : '@givethio';
	let message = '';
	if (contentType === EContentType.thisProject) {
		message = `This project is raising funds in crypto on ${socialHandle}! 💜
100% of every donation goes directly to the project to help them make an impact. Check it out 👇\n\n`;
	} else if (contentType === EContentType.ourProject) {
		message = `Our project is raising funds in crypto on ${socialHandle}! 💜
100% of every donation goes directly to our wallet to help us make an impact. Check out our project here 👇\n\n`;
	} else {
		message = `I just donated to this awesome project on ${socialHandle}! 💜 Read about their impact or support them here:\n\n`;
	}
	return message;
};

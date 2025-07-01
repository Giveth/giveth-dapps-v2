export enum EContentType {
	thisProject = 'thisProject',
	ourProject = 'ourProject',
	justDonated = 'justDonated',
	justDonatedRecurring = 'justDonatedRecurring',
	verifyProject = 'verifyProject',
}

export enum ESocialType {
	twitter = 'X (Twitter)',
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
	} else if (contentType === EContentType.justDonatedRecurring) {
		message = `I just started a recurring donation to this awesome project on ${socialHandle} with @Superfluid_HQ using @optimism. Read about their impact or support them here:\n\n`;
	} else if (contentType === EContentType.verifyProject) {
		message = `We're applying to become a GIVbacks eligible project on ${socialHandle}, a zero fee crypto donation platform. Check out our project here:\n`;
	} else {
		message = `I just donated to this awesome project on ${socialHandle}! 💜 Read about their impact or support them here:\n\n`;
	}
	return message;
};

export const shareContentCreatorCause = (
	contentType: EContentType,
	socialType: ESocialType,
) => {
	const socialHandle =
		socialType === ESocialType.twitter ? '@Giveth' : '@givethio';
	let message = '';
	if (contentType === EContentType.thisProject) {
		message = `This cause is raising funds in crypto on ${socialHandle}! 💜
	100% of every donation goes directly to the cause to help them make an impact. Check it out 👇\n\n`;
	} else if (contentType === EContentType.ourProject) {
		message = `Our cause is raising funds in crypto on ${socialHandle}! 💜
	100% of every donation goes directly to our wallet to help us make an impact. Check out our cause here 👇\n\n`;
	} else if (contentType === EContentType.justDonatedRecurring) {
		message = `I just started a recurring donation to this awesome cause on ${socialHandle} with @Superfluid_HQ using @optimism. Read about their impact or support them here:\n\n`;
	} else if (contentType === EContentType.verifyProject) {
		message = `We're applying to become a GIVbacks eligible cause on ${socialHandle}, a zero fee crypto donation platform. Check out our cause here:\n`;
	} else {
		message = `I just donated to this awesome cause on ${socialHandle}! 💜 Read about their impact or support them here:\n\n`;
	}
	return message;
};

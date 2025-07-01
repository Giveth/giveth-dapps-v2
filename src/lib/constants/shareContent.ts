export enum EContentType {
	thisProject = 'thisProject',
	ourProject = 'ourProject',
	justDonated = 'justDonated',
	justDonatedRecurring = 'justDonatedRecurring',
	verifyProject = 'verifyProject',
	ourCause = 'ourCause',
}

export enum EContentTypeCause {
	thisCause = 'thisCause',
	ourCause = 'ourCause',
	justDonated = 'justDonated',
	justDonatedRecurring = 'justDonatedRecurring',
	verifyCause = 'verifyCause',
	creationSuccess = 'creationSuccess',
	donationSuccess = 'donationSuccess',
	previewCard = 'previewCard',
	detailsPage = 'detailsPage',
}

export enum ESocialType {
	twitter = 'X (Twitter)',
	facebook = 'facebook',
	linkedin = 'linkedin',
}

export const shareContentCreator = (
	contentType: EContentType,
	socialType: ESocialType,
): string => {
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
	contentType: EContentTypeCause,
	socialType: ESocialType,
	numberOfProjects: number,
) => {
	const socialHandle =
		socialType === ESocialType.twitter ? '@Giveth' : '@givethio';
	let message = '';

	switch (contentType) {
		case EContentTypeCause.previewCard:
		case EContentTypeCause.detailsPage:
			message = `This Cause is raising funds for ${numberOfProjects} verified projects on ${socialHandle}! 💜\nAn AI-powered agent manages donations, redistributing them over time to the most impactful projects.\n\nCheck it out 👇`;
			break;
		case EContentTypeCause.creationSuccess:
			message = `Our Cause is raising funds for ${numberOfProjects} verified projects on ${socialHandle}! 💜\nAn AI-powered agent manages donations, redistributing them over time to the most impactful projects.\n\nCheck out our Cause here 👇`;
			break;
		case EContentTypeCause.donationSuccess:
			message = `I just donated to this Cause on ${socialHandle}, supporting ${numberOfProjects} verified projects! 💜 An AI-powered agent will automatically redistribute my funds to the most impactful projects.\n\nLearn more about this Cause 👇`;
			break;
		default:
			message = `This cause is raising funds in crypto on ${socialHandle}! 💜\n100% of every donation goes directly to the cause to help them make an impact. Check it out 👇`;
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

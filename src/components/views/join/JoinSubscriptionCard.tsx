import Image from 'next/image';
import styled from 'styled-components';
import {
	brandColors,
	neutralColors,
	SublineBold,
} from '@giveth/ui-design-system';
import { ChangeEvent } from 'react';

import { mediaQueries } from '@/lib/constants/constants';
import useNewsletterSubscription from '@/hooks/useNewsletterSubscription';
import News_letter from '/public/images/news_letter.svg';
import {
	HorizontalWrap,
	HorizontalTitleSection,
	Title,
	Caption,
	ButtonStyled,
} from '@/components/GeneralCard.sc';

const JoinSubscriptionCard = () => {
	const {
		email,
		setEmail,
		validateEmail,
		submitSubscription,
		error,
		successSubscription,
	} = useNewsletterSubscription();
	const titleText = successSubscription
		? 'Subscribed!'
		: 'Subscribe to our newsletter';
	const captionText = successSubscription
		? 'Thank you for subscribing to Giveth newsletter. Our first news are coming to your inbox soon.'
		: 'Subscribe to our newsletter to get the latest news, updates and amazing offers delivered directly straight to your mailbox!';
	return (
		<HorizontalWrap>
			<Image src={News_letter} alt='title' />
			<HorizontalTitleSection fullWidth>
				<Title>{titleText}</Title>
				<Caption fullWidth>{captionText} </Caption>
				{!successSubscription && (
					<SubscriptionActionWrapper>
						<InputWrapper>
							<EmailInput
								placeholder='Your Email Address'
								error={error}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setEmail(e.target.value)
								}
							/>
							{error && (
								<InvalidEmail>
									Please insert a valid email address!
								</InvalidEmail>
							)}
						</InputWrapper>
						<CustomizedButtonStyled
							disabled={!validateEmail(email)}
							label='Subscribe'
							buttonType='primary'
							onClick={submitSubscription}
						/>
					</SubscriptionActionWrapper>
				)}
			</HorizontalTitleSection>
		</HorizontalWrap>
	);
};

const CustomizedButtonStyled = styled(ButtonStyled)`
	&:disabled {
		background-color: ${neutralColors.gray[400]};
		color: white;
	}
	${mediaQueries.tablet} {
		margin: 0;
	}
`;

const InvalidEmail = styled(SublineBold)`
	color: ${brandColors.pinky[500]};
	position: absolute;
	top: 60px;
	left: 15px;
`;

const EmailInput = styled.input<{ error?: boolean }>`
	border: 1px solid #d7ddea;
	border-radius: 56px;
	padding: 14px 25px;
	height: 50px;
	width: 100%;
	max-width: 600px;
	&:focus {
		outline: none !important;
		border: 2px solid
			${props =>
				props.error ? brandColors.pinky[500] : brandColors.giv[500]};
	}
`;

const SubscriptionActionWrapper = styled.div`
	display: flex;
	width: 100%;
	gap: 16px;
	justify-content: start;
	flex-direction: column;
	align-items: center;
	margin-top: 24px;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const InputWrapper = styled.div`
	width: 100%;
	position: relative;
`;

export default JoinSubscriptionCard;

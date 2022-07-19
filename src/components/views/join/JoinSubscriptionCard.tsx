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
		? `You're In!`
		: 'Subscribe to our newsletter';
	const captionText = successSubscription ? (
		<span>
			We just sent you an email to confirm your subscription! Once you do,
			you'll receive the next issue of our newsletter in your inbox. If
			you'd like to view previous issues, visit our{' '}
			<StyledLink
				href='http://news.giveth.io/'
				target='_blank'
				rel='noreferrer'
			>
				GIVnews page
			</StyledLink>
			.
		</span>
	) : (
		<span>
			Subscribe to our newsletter to get the latest news, updates and
			amazing offers delivered directly straight to your mailbox!
		</span>
	);
	return (
		<HorizontalWrap>
			<Image src={News_letter} alt='title' />
			<HorizontalTitleSection fullWidth>
				<Title>{titleText}</Title>
				<Caption fullWidth>{captionText} </Caption>
				{!successSubscription && (
					<form
						action='https://www.getrevue.co/profile/giveth/add_subscriber'
						method='post'
						id='revue-form'
						name='revue-form'
						target='_blank'
						onSubmit={submitSubscription}
					>
						<SubscriptionActionWrapper>
							<InputWrapper>
								<EmailInput
									placeholder='Your Email Address'
									error={error}
									name='member[email]'
									id='member_email'
									onChange={(
										e: ChangeEvent<HTMLInputElement>,
									) => setEmail(e.target.value)}
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
								type='submit'
							/>
						</SubscriptionActionWrapper>
					</form>
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

const StyledLink = styled.a`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

export default JoinSubscriptionCard;

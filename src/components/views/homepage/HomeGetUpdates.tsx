import React from 'react';
import {
	H3,
	brandColors,
	P,
	Button,
	neutralColors,
	SublineBold,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { HomeContainer } from '@/components/views/homepage/Home.sc';
import { deviceSize } from '@/lib/constants/constants';
import useNewsletterSubscription from '@/hooks/useNewsletterSubscription';

const HomeGetUpdates = () => {
	const { formatMessage } = useIntl();
	const {
		email,
		setEmail,
		validateEmail,
		submitSubscription,
		error,
		successSubscription,
	} = useNewsletterSubscription();
	return (
		<Wrapper>
			<Container>
				<Title weight={700}>
					{successSubscription
						? formatMessage({ id: 'page.home.section.you_in' })
						: formatMessage({
								id: 'page.home.section.get_updates',
						  })}
				</Title>
				<P>
					{successSubscription ? (
						<span>
							{formatMessage({
								id: 'page.home.section.success_subs_one',
							})}
							<br />
							{formatMessage({
								id: 'page.home.section.success_subs_two',
							})}{' '}
							<StyledLink
								href='http://news.giveth.io/'
								target='_blank'
								rel='noreferrer'
							>
								GIVnews page
								{formatMessage({
									id: 'page.home.section.givnews_page',
								})}
							</StyledLink>
							.
						</span>
					) : (
						<span>
							{formatMessage({
								id: 'page.home.section.subscribe_newsletter',
							})}
						</span>
					)}
				</P>
				{!successSubscription && (
					<form
						action='https://www.getrevue.co/profile/giveth/add_subscriber'
						method='post'
						id='revue-form'
						name='revue-form'
						target='_blank'
						onSubmit={submitSubscription}
					>
						<InputBox>
							<div>
								<EmailInput
									placeholder={formatMessage({
										id: 'component.button.your_email_address',
									})}
									error={error}
									onChange={e => setEmail(e.target.value)}
									name='member[email]'
									id='member_email'
								/>
								{error && (
									<InvalidEmail>
										Please insert a valid email address!
									</InvalidEmail>
								)}
							</div>
							<SubscribeButton
								disabled={!validateEmail(email)}
								label={formatMessage({
									id: 'component.button.subscribe',
								})}
								type='submit'
							/>
						</InputBox>
					</form>
				)}
			</Container>
		</Wrapper>
	);
};

const Title = styled(H3)`
	color: ${brandColors.giv[500]};
	margin-bottom: 0.5rem;
`;

const InputBox = styled.div`
	display: flex;
	align-items: start;
	flex-wrap: wrap;
	gap: 16px;
	margin-top: 24px;
`;

const EmailInput = styled.input<{ error?: boolean }>`
	border: 1px solid #d7ddea;
	border-radius: 56px;
	padding: 14px 25px;
	height: 50px;
	&:focus {
		outline: none !important;
		border: 2px solid
			${props =>
				props.error ? brandColors.pinky[500] : brandColors.giv[500]};
	}
`;

const InvalidEmail = styled(SublineBold)`
	color: ${brandColors.pinky[500]};
	margin-top: 4px;
	margin-left: 24px;
`;

const SubscribeButton = styled(Button)`
	&:disabled {
		background-color: ${neutralColors.gray[400]};
		color: white;
	}
`;

const Container = styled.div`
	margin: 0 auto;
	max-width: ${deviceSize.desktop + 'px'};
`;

const Wrapper = styled(HomeContainer)`
	margin-top: 50px;
	margin-bottom: 50px;
`;

const StyledLink = styled.a`
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

export default HomeGetUpdates;

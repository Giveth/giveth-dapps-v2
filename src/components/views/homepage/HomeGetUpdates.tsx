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

import { HomeContainer } from '@/components/views/homepage/Home.sc';
import { deviceSize } from '@/lib/constants/constants';
import useNewsletterSubscription from '@/hooks/useNewsletterSubscription';

const HomeGetUpdates = () => {
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
						? 'Subscribed!'
						: 'Get the latest updates'}
				</Title>
				<P>
					{successSubscription
						? 'Thank you for subscribing to Giveth newsletter. Our first news are coming to your inbox soon.'
						: 'Subscribe to our newsletter to get monthly updates straight to your mailbox!'}
				</P>
				{!successSubscription && (
					<InputBox>
						<div>
							<EmailInput
								placeholder='Your email address'
								error={error}
								onChange={(
									e: React.ChangeEvent<HTMLInputElement>,
								) => setEmail(e.target.value)}
							/>
							{error && (
								<InvalidEmail>
									Please insert a valid email address!
								</InvalidEmail>
							)}
						</div>
						<SubscribeButton
							disabled={!validateEmail(email)}
							label='SUBSCRIBE'
							onClick={submitSubscription}
						/>
					</InputBox>
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

export default HomeGetUpdates;

import React, { useState } from 'react';
import {
	H3,
	brandColors,
	P,
	Button,
	neutralColors,
	SublineBold,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import { autopilotClient } from '@/services/autopilot';
import { HomeContainer } from '@/components/views/homepage/Home.sc';

function validateEmail(email: string): boolean {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email.toLowerCase());
}

const HomeGetUpdates = () => {
	const [email, setEmail] = useState<string>('');
	const [successSubscription, setSuccessSubscription] =
		useState<boolean>(false);

	const error: boolean = !validateEmail(email) && email !== '';

	const submitSubscription = () => {
		autopilotClient
			.post('/contact', {
				contact: {
					Email: email,
					_autopilot_list:
						'contactlist_6C5203EA-9A4E-4868-B5A9-7D943441E9CB',
				},
			})
			.then(() => setSuccessSubscription(true))
			.catch(e => console.log(e.response));
	};

	return (
		<Wrapper>
			<Title weight={700}>
				{successSubscription ? 'Subscribed!' : 'Get the latest updates'}
			</Title>
			<P>
				{successSubscription
					? 'Thank you for subscribing to Giveth newsletter. Our first news are coming to your inbox soon.'
					: 'Subscribe to our newsletter and get all updates straight to your mailbox!'}
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

const Wrapper = styled(HomeContainer)`
	margin-top: 50px;
	margin-bottom: 50px;
`;

export default HomeGetUpdates;

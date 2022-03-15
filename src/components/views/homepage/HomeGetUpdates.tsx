import { useState } from 'react';
import { Email_Input } from '@/components/styled-components/Input';
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
					></SubscribeButton>
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
	gap: 16px;
	margin-top: 24px;
`;

const EmailInput = styled(Email_Input)<{ error?: boolean }>`
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
	height: 52px;
	font-weight: bold;

	&:disabled {
		background-color: ${neutralColors.gray[400]};
		color: white;
	}
`;

const Wrapper = styled.div`
	margin: 50px 150px;
`;

export default HomeGetUpdates;

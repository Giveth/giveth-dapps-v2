import React from 'react';
import { TwitterShareButton } from 'react-share';
import { Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';

import useDeviceDetect from '@/hooks/useDeviceDetect';
import { mediaQueries } from '@/utils/constants';
// We need to add icon customization on the design system
import { Button } from '../../styled-components/Button';
import { isSSRMode } from '@/lib/helpers';
import { Modal } from '@/components/modals/Modal';

const GeminiModal = ({ setShowModal }: any) => {
	const url = !isSSRMode ? window?.location?.href : null;
	const { isMobile } = useDeviceDetect();
	if (isSSRMode) return null;
	return (
		<Modal showModal setShowModal={setShowModal}>
			<Container>
				<Lead>
					Giving Block projects only accept donations listed on Gemini
					- Help us get GIV on Gemini!
				</Lead>
				<img
					src={
						isMobile
							? '/images/twitter-modal-mobile.svg'
							: '/images/twitter-modal.svg'
					}
					alt='tw-modal'
					style={{ margin: '15px 0' }}
				/>
				<TwButton>
					<TwitterShareButton
						beforeOnClick={() => setShowModal(false)}
						title={
							'Hey @gemini - I want to donate $GIV to this @thegivingblock project on @givethio! Help me support them by listing $GIV on gemini.com @tyler @cameron'
						}
						url={url!}
						hashtags={['gemini', 'giveth', 'giv', 'donation']}
					>
						TWEET NOW
						<img
							src='/images/tw-icon.svg'
							alt='tweet-now'
							width='15px'
							height='15px'
						/>
					</TwitterShareButton>
				</TwButton>
				<CancelBtn onClick={() => setShowModal(false)}>
					CANCEL
				</CancelBtn>
			</Container>
		</Modal>
	);
};

const CancelBtn = styled.div`
	font-weight: bold;
	font-size: 12px;
	cursor: pointer;
	color: #a3b0f6;
	margin: 12px 0;
`;

const Container = styled.div`
	padding: 20px;
	text-align: center;
	max-width: 600px;

	${mediaQueries.tablet} {
		padding: 20px 60px;
	}
`;

const TwButton = styled(Button)`
	margin: 4px auto;
	color: white;
	width: 240px;
	height: 52px;
	border: 2px solid white;
	background-color: #00acee;
	> * {
		display: flex;
		align-items: center;
		gap: 6px;
		margin: 0 auto;
	}
	${mediaQueries.mobileS} {
		margin-top: 30px;
	}
`;

export default GeminiModal;

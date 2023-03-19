import Image from 'next/image';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { FC, useRef } from 'react';
import { mediaQueries } from '@giveth/ui-design-system';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { IModal } from '@/types/common';
import IconMail from '/public/images/icons/mail.svg';
import { useIsIFrameLoaded } from '@/hooks/useIsIFrameLoaded';
import LoadingAnimation from '@/animations/loading_giv.json';
import LottieControl from '@/components/LottieControl';
import { FlexCenter } from '@/components/styled-components/Flex';

const SubscribeNewsletter: FC<IModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();
	const iframeRef = useRef<HTMLIFrameElement>(null);

	const isIFrameLoaded = useIsIFrameLoaded(iframeRef);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<Image src={IconMail} alt='mail icon' />}
			headerTitle={formatMessage({ id: 'modal.news_letter' })}
			headerTitlePosition='left'
		>
			<Container>
				<iframe
					src='https://paragraph.xyz/@giveth/embed'
					scrolling='no'
					ref={iframeRef}
					style={{ display: isIFrameLoaded ? 'unset' : 'none' }}
				/>
				{!isIFrameLoaded && (
					<FlexCenter>
						<LottieControl
							animationData={LoadingAnimation}
							size={300}
						/>
					</FlexCenter>
				)}
			</Container>
		</Modal>
	);
};

const Container = styled(FlexCenter)`
	padding: 0 21px;
	> * {
		height: 550px;
		width: 350px;
		border-color: transparent !important;
		margin-top: -30px;
		${mediaQueries.tablet} {
			width: 480px;
			height: 510px;
		}
	}
`;

export default SubscribeNewsletter;

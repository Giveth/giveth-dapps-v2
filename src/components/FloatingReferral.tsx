import React, { useState } from 'react';
import Image from 'next/image';
import styled, { keyframes } from 'styled-components';
import { useIntl } from 'react-intl';
import {
	B,
	brandColors,
	IconChevronUp,
	IconChevronDown,
	Button,
	neutralColors,
	mediaQueries,
} from '@giveth/ui-design-system';
import { FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';
import { EContentType } from '@/lib/constants/shareContent';
import ShareRewardedModal from '@/components/modals/ShareRewardedModal';

const FloatingButtonReferral: React.FC = () => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { formatMessage } = useIntl();

	const handleClick = () => {
		setIsOpen(!isOpen);
	};

	return (
		<FloatingContainer>
			{showModal && (
				<ShareRewardedModal
					contentType={EContentType.thisProject}
					setShowModal={setShowModal}
				/>
			)}
			{isOpen && (
				<Message>
					<Body>
						Share this page with your friends, and get rewarded when
						they donate to verified projects!
					</Body>
					<StyledShareButton
						label={formatMessage({
							id: 'label.share_and_get_rewarded',
						})}
						onClick={async () => {
							setShowModal(true);
							setIsOpen(false);
						}}
						buttonType='texty-gray'
						icon={
							<Image
								src='/images/icons/gift_pink.svg'
								width={16}
								height={16}
								alt='gift'
							/>
						}
						size='small'
					/>
				</Message>
			)}
			<ButtonContainer isOpen={isOpen}>
				<FloatingButton onClick={handleClick} isOpen={isOpen}>
					Refer your friends{' '}
					{isOpen ? (
						<IconChevronDown color={brandColors.pinky[500]} />
					) : (
						<IconChevronUp color={brandColors.pinky[500]} />
					)}
				</FloatingButton>
			</ButtonContainer>
		</FloatingContainer>
	);
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(2rem);
  }
  to {
    transform: translateY(0);
  }
`;

const FloatingContainer = styled(FlexCenter)`
	display: none;
	position: fixed;
	bottom: 2rem;
	left: 2rem;
	width: 271px;
	z-index: 2;
	box-shadow: ${Shadow.Giv[400]} !important;
	justify-content: center;
	${mediaQueries.tablet} {
		display: block;
	}
`;

const FloatingButton = styled.button<{ isOpen: boolean }>`
	background-color: white;
	border: none;
	width: 271px;
	height: 56px;
	align-items: center;
	padding: 18px 24px;
	cursor: pointer;
	box-shadow: ${Shadow.Neutral[400]};
	color: ${props =>
		props.isOpen ? neutralColors.gray[800] : brandColors.pinky[500]};
	font-weight: 500;
	font-size: 14px;
	line-height: 150%;
	display: flex;
	justify-content: space-between;
	z-index: 2;
	position: relative;
	border-radius: ${props => (!props.isOpen ? '12px' : '0')};
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
`;

const ButtonContainer = styled.div<{ isOpen: boolean }>`
	display: flex;
	flex-direction: column-reverse;
	transform: ${props =>
		props.isOpen ? 'translateY(-283%)' : 'translateY(0)'};
	transition: transform 0.3s ease-in-out;
`;

const Message = styled(FlexCenter)`
	flex-direction: column;
	position: absolute;
	background-color: white;
	padding: 1rem;
	width: 100%;
	animation: ${fadeIn} 0.3s ease-in-out, ${slideIn} 0.3s ease-in-out;
	position: absolute;
	bottom: 0;
	border-bottom-left-radius: 12px;
	border-bottom-right-radius: 12px;
	z-index: 1;
`;

const StyledShareButton = styled(Button)`
	box-shadow: 0px 3px 20px rgba(212, 218, 238, 0.4);
	flex-direction: row-reverse;
	gap: 8px;
	padding: 16px 10px;
	color: ${brandColors.pinky[500]};
	margin: 18px 0 0 0;
	&:hover {
		color: ${brandColors.pinky[500]};
	}
	& > div[loading='1'] > div {
		left: 0;
	}
	padding: 16px 8px;
	* {
		font-size: 12px;
		text-transform: capitalize;
	}
`;

const Body = styled(B)`
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	line-height: 150%;
	color: ${neutralColors.gray[800]};
	padding: 16px 0 0 0;
	border-top: 1px solid ${neutralColors.gray[300]};
`;

export default FloatingButtonReferral;

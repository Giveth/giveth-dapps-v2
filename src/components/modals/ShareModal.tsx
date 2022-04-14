import { useState } from 'react';
import {
	FacebookShareButton,
	TwitterShareButton,
	LinkedinShareButton,
} from 'react-share';
import Image from 'next/image';
import styled from 'styled-components';
import {
	brandColors,
	GLink,
	H5,
	Lead,
	neutralColors,
	OulineButton,
} from '@giveth/ui-design-system';

import { IModal, Modal } from './Modal';
import FacebookIcon from '../../../public/images/social-fb.svg';
import LinkedinIcon from '../../../public/images/social-linkedin.svg';
import TwitterIcon from '../../../public/images/social-tw.svg';
import ShareIcon from '../../../public/images/icons/share_dots.svg';
import { FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';
import { slugToProjectView } from '@/lib/routeCreators';
import { isSSRMode } from '@/lib/helpers';

interface IShareModal extends IModal {
	projectHref: string;
}

const ShareModal = ({ projectHref, setShowModal }: IShareModal) => {
	const [copyText, setCopyText] = useState('copy link');

	if (isSSRMode) {
		return null;
	}

	const url: string = window.location.origin + slugToProjectView(projectHref);

	const handleCopy = () => {
		navigator.clipboard.writeText(url);
		setCopyText('copied!');
	};

	return (
		<Modal
			showModal
			setShowModal={setShowModal}
			headerIcon={<Image src={ShareIcon} alt='share icon' />}
			headerTitle='Share'
			headerTitlePosition='left'
		>
			<Subtitle weight={700}>Share this with your friends!</Subtitle>
			<FlexCenter gap={'16px'}>
				<SocialButtonContainer>
					<TwitterShareButton
						hashtags={['giveth']}
						title={'Check out on @Givethio'}
						url={url}
					>
						<Image src={TwitterIcon} alt='twitter icon' />
					</TwitterShareButton>
				</SocialButtonContainer>
				<SocialButtonContainer>
					<LinkedinShareButton
						title={'Check out on @Givethio'}
						url={url}
					>
						<Image src={LinkedinIcon} alt='twitter icon' />
					</LinkedinShareButton>
				</SocialButtonContainer>
				<SocialButtonContainer>
					<FacebookShareButton
						hashtag='#giveth'
						quote='Check out on @Givethio'
						url={url}
					>
						<Image src={FacebookIcon} alt='twitter icon' />
					</FacebookShareButton>
				</SocialButtonContainer>
			</FlexCenter>
			<LeadText>Or copy the link</LeadText>
			<DashedWrapper>
				<ProjectLink size='Small'>{url}</ProjectLink>
				<VerticalLine />
				<CustomOutlineButton
					buttonType='texty'
					color={brandColors.pinky[500]}
					size='small'
					label={copyText}
					onClick={handleCopy}
				/>
			</DashedWrapper>
			<CustomOutlineButton
				buttonType='texty'
				color={brandColors.deep[100]}
				size='small'
				label='dismiss'
				marginBottom='16px'
				onClick={() => setShowModal(false)}
			/>
		</Modal>
	);
};

const Subtitle = styled(H5)`
	color: ${brandColors.deep[900]};
	padding: 16px 0 32px;
`;

const SocialButtonContainer = styled(FlexCenter)`
	height: 45px;
	width: 45px;
	border: 1px solid ${neutralColors.gray[400]} !important;
	border-radius: 8px;
	cursor: pointer;

	* {
		height: 40px;
		width: 40px;
	}
`;

const LeadText = styled(Lead)`
	margin: 16px 0;
	color: ${brandColors.deep[900]};
`;

const DashedWrapper = styled(FlexCenter)`
	border: 1px dashed ${neutralColors.gray[400]};
	border-radius: 8px;
	margin: 16px 24px 24px;
	box-shadow: ${Shadow.Neutral[400]};
`;

const ProjectLink = styled(GLink)`
	padding: 0 24px;
	color: ${neutralColors.gray[700]};
`;

const VerticalLine = styled.div`
	border-left: 1px solid ${neutralColors.gray[400]};
	height: 16px;
`;

interface ICustomOutlineButton {
	color: string;
	marginBottom?: string;
}

const CustomOutlineButton = styled(OulineButton)<ICustomOutlineButton>`
	text-transform: uppercase;
	font-weight: 700;
	border: none;
	color: ${props => props.color};
	margin: ${props => `0 auto ${props.marginBottom}`};

	&:hover {
		color: ${props => props.color}70;
	}
`;

export default ShareModal;

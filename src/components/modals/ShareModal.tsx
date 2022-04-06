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
import links from '@/lib/constants/links';

interface IShareModal extends IModal {
	projectHref: string;
	projectDescription?: string;
}

const ShareModal = ({
	projectHref,
	projectDescription,
	showModal,
	setShowModal,
}: IShareModal) => {
	const url: string = `${links.FRONTEND}project/${projectHref}`;
	return (
		<Modal
			showModal={showModal}
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
					label='copy link'
				/>
			</DashedWrapper>
			<CustomOutlineButton
				buttonType='texty'
				color={brandColors.deep[100]}
				size='small'
				label='dismiss'
				marginBottom='16px'
			/>
		</Modal>
	);
};

const Subtitle = styled(H5)`
	color: ${brandColors.deep[900]};
	padding: 16px 0px 32px;
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
	margin: 16px 0px;
	color: ${brandColors.deep[900]};
`;

const DashedWrapper = styled(FlexCenter)`
	border: 1px dashed ${neutralColors.gray[400]};
	border-radius: 8px;
	margin: 16px 24px 24px;
	box-shadow: ${Shadow.Neutral[400]};
`;

const ProjectLink = styled(GLink)`
	padding: 0px 24px;
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
	margin: auto;
	margin-bottom: ${props => props.marginBottom};

	&:hover {
		color: ${props => props.color}70;
	}
`;

export default ShareModal;

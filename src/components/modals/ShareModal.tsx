import {
	FacebookShareButton,
	TwitterShareButton,
	LinkedinShareButton,
} from 'react-share';
import Image from 'next/image';
import styled from 'styled-components';
import {
	brandColors,
	H5,
	Lead,
	neutralColors,
	OulineButton,
} from '@giveth/ui-design-system';

import { Modal } from './Modal';
import FacebookIcon from '../../../public/images/social-fb.svg';
import LinkedinIcon from '../../../public/images/social-linkedin.svg';
import TwitterIcon from '../../../public/images/social-tw.svg';
import ShareIcon from '../../../public/images/icons/share_dots.svg';
import { FlexCenter } from '@/components/styled-components/Flex';
import { slugToProjectView } from '@/lib/routeCreators';
import { IModal } from '@/types/common';
import CopyLink from '@/components/CopyLink';
import { fullPath } from '@/lib/helpers';

interface IShareModal extends IModal {
	projectHref: string;
}

const ShareModal = ({ projectHref, setShowModal }: IShareModal) => {
	const url = fullPath(slugToProjectView(projectHref));

	return (
		<Modal
			setShowModal={setShowModal}
			headerIcon={<Image src={ShareIcon} alt='share icon' />}
			headerTitle='Share'
			headerTitlePosition='left'
		>
			<Container>
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
				<CopyLink url={url} />
				<CustomOutlineButton
					buttonType='texty'
					size='small'
					label='dismiss'
					onClick={() => setShowModal(false)}
				/>
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	padding: 24px;
`;

const Subtitle = styled(H5)`
	color: ${brandColors.deep[900]};
	margin-bottom: 32px;
`;

const SocialButtonContainer = styled(FlexCenter)`
	height: 45px;
	width: 45px;
	border: 1px solid ${neutralColors.gray[400]} !important;
	border-radius: 8px;
	cursor: pointer;

	> * {
		height: 40px;
		width: 40px;
	}
`;

const LeadText = styled(Lead)`
	margin: 16px 0;
	color: ${brandColors.deep[900]};
`;

const CustomOutlineButton = styled(OulineButton)`
	text-transform: uppercase;
	font-weight: 700;
	border: none;
	color: ${brandColors.deep[100]};
	margin: 24px auto 0;
`;

export default ShareModal;

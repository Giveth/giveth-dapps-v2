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
	OutlineButton,
} from '@giveth/ui-design-system';

import { useIntl } from 'react-intl';
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
import { useModalAnimation } from '@/hooks/useModalAnimation';

interface IShareModal extends IModal {
	projectHref: string;
}

const ShareModal = ({ projectHref, setShowModal }: IShareModal) => {
	const url = fullPath(slugToProjectView(projectHref));
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerIcon={<Image src={ShareIcon} alt='share icon' />}
			headerTitle={formatMessage({ id: 'label.share' })}
			headerTitlePosition='left'
		>
			<Container>
				<Subtitle weight={700}>
					{formatMessage({ id: 'label.share_this' })}!
				</Subtitle>
				<FlexCenter gap={'16px'}>
					<SocialButtonContainer>
						<TwitterShareButton
							hashtags={['giveth']}
							title={`${formatMessage({
								id: 'label.check_out_on',
							})} @Givethio`}
							url={url}
						>
							<Image src={TwitterIcon} alt='twitter icon' />
						</TwitterShareButton>
					</SocialButtonContainer>
					<SocialButtonContainer>
						<LinkedinShareButton
							title={`${formatMessage({
								id: 'label.check_out_on',
							})} @Givethio`}
							url={url}
						>
							<Image src={LinkedinIcon} alt='twitter icon' />
						</LinkedinShareButton>
					</SocialButtonContainer>
					<SocialButtonContainer>
						<FacebookShareButton
							hashtag='#giveth'
							quote={`${formatMessage({
								id: 'label.check_out_on',
							})} @Givethio`}
							url={url}
						>
							<Image src={FacebookIcon} alt='facebook icon' />
						</FacebookShareButton>
					</SocialButtonContainer>
				</FlexCenter>
				<LeadText>
					{formatMessage({ id: 'label.or_copy_the_link' })}
				</LeadText>
				<CopyLink url={url} />
				<CustomOutlineButton
					buttonType='texty'
					size='small'
					label={formatMessage({ id: 'label.dismiss' })}
					onClick={closeModal}
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

const CustomOutlineButton = styled(OutlineButton)`
	text-transform: uppercase;
	font-weight: 700;
	border: none;
	color: ${brandColors.deep[100]};
	margin: 24px auto 0;
`;

export default ShareModal;

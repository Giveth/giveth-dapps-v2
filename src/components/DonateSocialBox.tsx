import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import {
	Flex,
	Lead,
	neutralColors,
	brandColors,
	Subline,
	IconChevronRight16,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Link from 'next/link';
import { useProjectContext } from '@/context/project.context';
import useDetectDevice from '@/hooks/useDetectDevice';
import { IProject } from '@/apollo/types/types';
import { EContentType } from '@/lib/constants/shareContent';
import ShareLikeBadge from '@/components/badges/ShareLikeBadge';
import ShareModal from '@/components/modals/ShareModal';
import Routes from '@/lib/constants/Routes';

interface ISocialBox {
	project: IProject;
	contentType: EContentType;
	isDonateFooter?: boolean;
}

const DonateSocialBox: FC<ISocialBox> = props => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const { project, isDonateFooter } = props;
	const { slug, verified } = project;
	const { isMobile } = useDetectDevice();
	const { formatMessage } = useIntl();
	const { isActive } = useProjectContext();

	return (
		<Social $isDonateFooter={isDonateFooter}>
			{showModal && slug && (
				<ShareModal
					contentType={EContentType.thisProject}
					setShowModal={setShowModal}
					projectHref={slug}
				/>
			)}
			<BLead>
				{isDonateFooter
					? formatMessage({ id: 'label.cant_donate' })
					: formatMessage({ id: 'label.share_this' })}
			</BLead>

			<BadgeWrapper>
				<ShareLikeBadge
					type={verified ? 'reward' : 'share'}
					onClick={() => isActive && setShowModal(true)}
					isSimple={isMobile}
					fromDonate={true}
				/>
			</BadgeWrapper>

			<Link href={Routes.Onboarding + '/donors'}>
				<LearnLink
					$alignItems='center'
					$justifyContent='center'
					gap='2px'
				>
					<Subline>
						{formatMessage({
							id: 'label.learn_more_about_donating_on_giveth',
						})}
					</Subline>
					<IconChevronRight16 />
				</LearnLink>
			</Link>
		</Social>
	);
};

const BLead = styled(Lead)`
	line-height: 30px;
	font-weight: 400;
	color: ${neutralColors.gray[900]};
	z-index: 2;
`;

const Social = styled.div<{ $isDonateFooter?: boolean }>`
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: ${props => (props.$isDonateFooter ? '32px 0' : '50px 0')};
	color: ${neutralColors.gray[900]};
	align-items: center;
`;

const BadgeWrapper = styled(Flex)`
	margin-top: 16px;
	justify-content: space-between;
	gap: 8px;
`;

const LearnLink = styled(Flex)`
	color: ${brandColors.pinky[500]};
	margin-top: 20px;
	&:hover {
		color: ${brandColors.pinky[700]};
	}
`;

export default DonateSocialBox;

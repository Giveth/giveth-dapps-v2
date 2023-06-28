import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { Lead, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useProjectContext } from '@/context/project.context';
import useDetectDevice from '@/hooks/useDetectDevice';
import { IProject } from '@/apollo/types/types';
import { EContentType } from '@/lib/constants/shareContent';
import { Flex } from '@/components/styled-components/Flex';
import ShareLikeBadge from '@/components/badges/ShareLikeBadge';
import ShareRewardModal from '@/components/modals/ShareRewardedModal';
import ShareModal from '@/components/modals/ShareModal';

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
		<Social isDonateFooter={isDonateFooter}>
			{showModal &&
				slug &&
				(verified ? (
					<ShareRewardModal
						contentType={EContentType.thisProject}
						setShowModal={setShowModal}
						projectHref={slug}
					/>
				) : (
					<ShareModal
						contentType={EContentType.thisProject}
						setShowModal={setShowModal}
						projectHref={slug}
					/>
				))}
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
		</Social>
	);
};

const BLead = styled(Lead)`
	line-height: 30px;
	font-weight: 400;
	color: ${neutralColors.gray[900]};
	z-index: 2;
`;

const Social = styled.div<{ isDonateFooter?: boolean }>`
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: ${props => (props.isDonateFooter ? '32px 0' : '50px 0')};
	color: ${neutralColors.gray[900]};
	align-items: center;
`;

const BadgeWrapper = styled(Flex)`
	margin-top: 16px;
	justify-content: space-between;
	gap: 8px;
`;

export default DonateSocialBox;

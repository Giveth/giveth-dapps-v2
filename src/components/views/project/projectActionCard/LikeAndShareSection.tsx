import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@giveth/ui-design-system';
import ShareModal from '@/components/modals/ShareModal';
import { EContentType } from '@/lib/constants/shareContent';
import { useProjectContext } from '@/context/project.context';
import { Flex } from '@/components/styled-components/Flex';

export const LikeAndShareSection = () => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const { projectData } = useProjectContext();
	const { slug } = projectData || {};
	return (
		<>
			<BadgeWrapper gap='8px'>
				{/* <ShareLikeBadge
					type='share'
					onClick={() => isActive && setShowModal(true)}
				/>
				<ShareLikeBadge
					type='like'
					active={heartedByUser}
					isSimple={isMobile}
				/> */}
				<Button
					label='Share'
					onClick={() => setShowModal(true)}
					buttonType='texty-gray'
				/>
			</BadgeWrapper>
			{showModal && slug && (
				<ShareModal
					contentType={EContentType.thisProject}
					setShowModal={setShowModal}
					projectHref={slug}
				/>
			)}
		</>
	);
};

const BadgeWrapper = styled(Flex)`
	margin: 16px 0;
	justify-content: space-between;
`;

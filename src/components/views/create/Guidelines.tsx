import Image from 'next/image';
import { useIntl } from 'react-intl';
import { H6 } from '@giveth/ui-design-system';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import LightBulbIcon from '../../../../public/images/icons/lightbulb.svg';
import { ProjectGuidelineModal } from '@/components/modals/ProjectGuidelineModal';
import Routes from '@/lib/constants/Routes';

const Guidelines = () => {
	const [showGuidelineModal, setShowGuidelineModal] = useState(false);
	const { formatMessage } = useIntl();

	const router = useRouter();
	const isCreateMode = router.pathname.includes(Routes.CreateProject);

	useEffect(() => {
		if (isCreateMode) {
			setShowGuidelineModal(true);
		}
	}, []);

	return (
		<>
			<GuidelinesCard onClick={() => setShowGuidelineModal(true)}>
				<Image src={LightBulbIcon} alt='Light Bulb Icon' />
				<H6>{formatMessage({ id: 'label.submission_guidelines' })}</H6>
			</GuidelinesCard>
			{showGuidelineModal && (
				<ProjectGuidelineModal setShowModal={setShowGuidelineModal} />
			)}
		</>
	);
};

const GuidelinesCard = styled.div`
	user-select: none;
`;

export default Guidelines;

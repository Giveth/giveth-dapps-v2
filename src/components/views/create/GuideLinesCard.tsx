import Image from 'next/image';
import { useIntl } from 'react-intl';
import { H6, mediaQueries } from '@giveth/ui-design-system';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import LightBulbIcon from '../../../../public/images/icons/lightbulb.svg';
import Routes from '@/lib/constants/Routes';
import { Shadow } from '@/components/styled-components/Shadow';
import { Flex } from '@/components/styled-components/Flex';
import { ProjectGuidelineModal } from '@/components/modals/ProjectGuidelineModal';

export const GuidelinesCard = () => {
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
		<GuidelinesCardWrapper onClick={() => setShowGuidelineModal(true)}>
			<Image src={LightBulbIcon} alt='Light Bulb Icon' />
			<H6>{formatMessage({ id: 'label.submission_guidelines' })}</H6>
			{showGuidelineModal && (
				<ProjectGuidelineModal setShowModal={setShowGuidelineModal} />
			)}
		</GuidelinesCardWrapper>
	);
};

const GuidelinesCardWrapper = styled(Flex)`
	user-select: none;
	height: 87px;
	align-items: center;
	gap: 20px;
	padding: 28px 30px 28px 28px;
	border-radius: 8px;
	box-shadow: ${Shadow.Dark[500]};
	position: relative;
	cursor: pointer;
	margin-bottom: 20px;
	${mediaQueries.laptopL} {
		position: sticky;
		top: 104px;
	}
	& > h6 {
		font-weight: 700;
	}
`;

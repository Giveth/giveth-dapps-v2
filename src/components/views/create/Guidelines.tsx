import Image from 'next/image';
import { useIntl } from 'react-intl';
import { H6 } from '@giveth/ui-design-system';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import LightBulbIcon from '../../../../public/images/icons/lightbulb.svg';
import Routes from '@/lib/constants/Routes';
import { Shadow } from '@/components/styled-components/Shadow';

interface IProps {
	setShowGuidelineModal: (i: boolean) => void;
	isLaptop?: boolean;
}

const Guidelines = (props: IProps) => {
	const { setShowGuidelineModal, isLaptop } = props;
	const { formatMessage } = useIntl();

	const router = useRouter();
	const isCreateMode = router.pathname.includes(Routes.CreateProject);

	useEffect(() => {
		if (isCreateMode) {
			setShowGuidelineModal(true);
		}
	}, []);

	return (
		<GuidelinesCard
			isLaptop={isLaptop}
			onClick={() => setShowGuidelineModal(true)}
		>
			<Image src={LightBulbIcon} alt='Light Bulb Icon' />
			<H6>{formatMessage({ id: 'label.submission_guidelines' })}</H6>
		</GuidelinesCard>
	);
};

const GuidelinesCard = styled.div<{ isLaptop?: boolean }>`
	max-width: 380px;
	user-select: none;
	display: flex;
	height: 87px;
	align-items: center;
	gap: 20px;
	padding: 28px 30px 28px 28px;
	border-radius: 8px;
	box-shadow: ${Shadow.Dark[500]};
	position: relative;
	cursor: pointer;
	margin-bottom: 20px;
	${props =>
		props.isLaptop &&
		`position: sticky;
		top: 104px;`}
	> h6 {
		font-weight: 700;
	}
`;

export default Guidelines;

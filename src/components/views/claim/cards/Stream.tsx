import { useState, FC, useEffect } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { H2, Lead, H5 } from '@giveth/ui-design-system';
import { ArrowButton, Card, PreviousArrowButton } from './common';

import useGIVTokenDistroHelper from '@/hooks/useGIVTokenDistroHelper';
import { formatWeiHelper } from '@/helpers/number';
import { durationToString } from '@/lib/helpers';
import useClaim from '@/context/claim.context';
import { Flex } from '@/components/styled-components/Flex';
import { IClaimViewCardProps } from '../Claim.view';

const StreamCardContainer = styled(Card)`
	::before {
		content: '';
		background-image: url('/images/donate.png');
		position: absolute;
		width: 305px;
		height: 333px;
		top: 0;
		right: 0;
		z-index: -1;
	}
	@media only screen and (max-width: 1360px) {
		padding-right: 112px;
		::before {
			width: 240px;
			background-size: contain;
			background-repeat: no-repeat;
		}
	}
	@media only screen and (max-width: 1120px) {
		padding: 8px;
		::before {
			background-image: none;
		}
	}
`;

const StreamHeader = styled.div`
	margin-bottom: 48px;
`;

const Title = styled(H2)`
	width: 720px;
	font-size: 3em;
	font-weight: 700;
	@media only screen and (max-width: 1120px) {
		width: 100%;
	}
`;

const Desc = styled(Lead)`
	width: 700px;
	margin-top: 22px;
	@media only screen and (max-width: 1120px) {
		width: 100%;
	}
`;
const StreamRow = styled(Flex)`
	padding: 20px 0;
	height: 208px;
`;

const StreamSubtitle = styled.div`
	margin-top: 16px;
	font-size: 16px;
`;

const StreamContainer = styled(Flex)`
	padding: 20px 0;
`;

const StreamValueContainer = styled(Flex)`
	padding: 20px 60px;
	gap: 12px;
	@media only screen and (max-width: 1120px) {
		padding: 20px;
	}
`;

const StreamValue = styled.div`
	font-size: 66px;
	font-weight: 500;
	line-height: 66px;
`;

const StreamPlaceholder = styled(Flex)`
	font-size: 32px;
	color: #b9a7ff;
	align-self: flex-end;
	gap: 6px;
`;

export const StreamCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { totalAmount, step, goNextStep, goPreviousStep } = useClaim();
	const [streamValue, setStreamValue] = useState<string>('0');
	const [remain, setRemain] = useState('');
	const { formatMessage } = useIntl();

	const { givTokenDistroHelper } = useGIVTokenDistroHelper();

	useEffect(() => {
		setStreamValue(
			formatWeiHelper(
				givTokenDistroHelper.getStreamPartTokenPerWeek(totalAmount),
			),
		);
	}, [totalAmount, givTokenDistroHelper]);

	useEffect(() => {
		const _remain = durationToString(givTokenDistroHelper.remain);
		setRemain(_remain);
	}, [givTokenDistroHelper]);

	return (
		<StreamCardContainer activeIndex={step} index={index}>
			<StreamHeader>
				<Title as='h1'>Enjoy a continuous flow of GIV</Title>

				<Desc>
					Welcome to the expanding GIViverse! The <b>GIVstream</b>{' '}
					offers continuous rewards for GIVeconomy participants. As
					the GIVeconomy grows, so does your GIV!
				</Desc>
			</StreamHeader>
			<StreamRow alignItems={'center'}>
				<StreamContainer flexDirection='column'>
					<H5 as='h2' weight={700}>
						Your flowrate
					</H5>
					<StreamSubtitle>Time remaining: {remain}</StreamSubtitle>
				</StreamContainer>
				<StreamValueContainer alignItems={'center'}>
					<Image
						src='/images/icons/thunder.svg'
						height='56'
						width='32'
						alt='Thunder image'
					/>
					<StreamValue>{streamValue}</StreamValue>
					<StreamPlaceholder>
						GIV{formatMessage({ id: 'label./week' })}
					</StreamPlaceholder>
				</StreamValueContainer>
			</StreamRow>
			{step === index && (
				<>
					<ArrowButton onClick={goNextStep} />
					<PreviousArrowButton onClick={goPreviousStep} />
				</>
			)}
		</StreamCardContainer>
	);
};

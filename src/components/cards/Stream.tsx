import { useState, ChangeEvent, FC, useContext, useEffect } from 'react';
import Image from 'next/image';
import { utils } from 'ethers';
import styled from 'styled-components';
import { InputWithUnit } from '../input';
import { Row } from '../styled-components/Grid';
import {
	ArrowButton,
	Card,
	Header,
	ICardProps,
	MaxGIV,
	PreviousArrowButton,
} from './common';
import { UserContext } from '../../context/user.context';
import { IClaimViewCardProps } from '../views/claim/Claim.view';

import { useTokenDistro } from '@/context/tokenDistro.context';
import { formatWeiHelper } from '@/helpers/number';
import { DurationToString } from '@/lib/helpers';
import { H2, Lead, H5 } from '@giveth/ui-design-system';

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
const StreamRow = styled(Row)`
	padding: 20px 0;
	height: 208px;
`;

const StreamSubtitle = styled.div`
	margin-top: 16px;
	font-size: 16px;
`;

const StreamContainer = styled(Row)`
	padding: 20px 0px;
`;

const StreamValueContainer = styled(Row)`
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

const StreamPlaceholder = styled(Row)`
	font-size: 32px;
	color: #b9a7ff;
	align-self: flex-end;
	gap: 6px;
`;

export const StreamCard: FC<IClaimViewCardProps> = ({ index }) => {
	const { totalAmount, step, goNextStep, goPreviousStep } =
		useContext(UserContext);
	const [streamValue, setStreamValue] = useState<string>('0');
	const [remain, setRemain] = useState('');

	const { tokenDistroHelper } = useTokenDistro();

	useEffect(() => {
		setStreamValue(
			formatWeiHelper(
				tokenDistroHelper.getStreamPartTokenPerWeek(totalAmount),
			),
		);
	}, [totalAmount, tokenDistroHelper]);

	useEffect(() => {
		const _remain = DurationToString(tokenDistroHelper.remain);
		setRemain(_remain);
	}, [tokenDistroHelper]);

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
					<StreamPlaceholder>GIV/week</StreamPlaceholder>
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

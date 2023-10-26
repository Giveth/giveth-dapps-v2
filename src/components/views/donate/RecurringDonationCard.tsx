import {
	B,
	Caption,
	H6,
	IconCaretDown16,
	IconHelpFilled16,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ChainNativeCurrency } from 'viem/_types/types/chain';
import { Flex } from '@/components/styled-components/Flex';
import { FlowRateTooltip } from '@/components/GIVeconomyPages/GIVstream.sc';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { SelectTokenModal } from './SelectTokenModal/SelectTokenModal';
import { IToken } from '@/types/config';
import { TokenIcon } from './TokenIcon';

export interface ISelectTokenWithBalance {
	token: IToken | ChainNativeCurrency;
	balance?: bigint;
}

export const RecurringDonationCard = () => {
	const [showSelectTokenModal, setShowSelectTokenModal] = useState(false);
	const [selectedToken, setSelectedToken] = useState<
		ISelectTokenWithBalance | undefined
	>();

	return (
		<>
			<Title weight={700}>
				Make a recurring donation with{' '}
				<a href='https://www.superfluid.finance/' target='_blank'>
					SuperFluid
				</a>
			</Title>
			<Desc>
				Provide continuous funding by streaming your donations over
				time.
			</Desc>
			<RecurringSection>
				<RecurringSectionTitle>
					Creating a Monthly recurring donation
				</RecurringSectionTitle>
				<Flex flexDirection='column' gap='8px'>
					<Flex gap='8px' alignItems='center'>
						<Caption>Stream Balance</Caption>
						<IconWithTooltip
							icon={<IconHelpFilled16 />}
							direction='right'
							align='bottom'
						>
							<FlowRateTooltip>
								The rate at which you receive liquid GIV from
								your GIVstream.here!
							</FlowRateTooltip>
						</IconWithTooltip>
					</Flex>
					<InputWrapper>
						<SelectTokenWrapper
							alignItems='center'
							justifyContent='space-between'
							onClick={() => setShowSelectTokenModal(true)}
						>
							{selectedToken ? (
								<Flex gap='8px' alignItems='center'>
									<TokenIcon
										symbol={selectedToken.token.symbol}
										size={24}
									/>
									<B>{selectedToken.token.symbol}</B>
								</Flex>
							) : (
								<B>Select Token</B>
							)}
							<IconCaretDown16 />
						</SelectTokenWrapper>
						<Input type='text' />
					</InputWrapper>
				</Flex>
			</RecurringSection>
			{showSelectTokenModal && (
				<SelectTokenModal
					setShowModal={setShowSelectTokenModal}
					setSelectedToken={setSelectedToken}
				/>
			)}
		</>
	);
};

const Title = styled(H6)`
	& > a {
		color: ${brandColors.pinky[500]};
	}
`;

const Desc = styled(Caption)`
	background-color: ${neutralColors.gray[200]};
	padding: 8px;
	width: 100%;
	text-align: left;
`;

const RecurringSection = styled(Flex)`
	flex-direction: column;
	gap: 24px;
	padding: 16px;
	border-radius: 12px;
	border: 1px solid ${neutralColors.gray[300]};
	width: 100%;
`;

const RecurringSectionTitle = styled(B)`
	width: 100%;
	padding-bottom: 8px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	text-align: left;
`;

const SelectTokenWrapper = styled(Flex)`
	cursor: pointer;
`;

const InputWrapper = styled(Flex)`
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	overflow: hidden;
	& > * {
		padding: 13px 16px;
	}
	align-items: center;
`;

const Input = styled.input`
	border: none;
	flex: 1;
	border-left: 2px solid ${neutralColors.gray[300]};
	font-family: Red Hat Text;
	font-size: 16px;
	font-style: normal;
	font-weight: 500;
	line-height: 150%; /* 24px */
`;

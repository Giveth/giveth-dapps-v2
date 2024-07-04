import styled from 'styled-components';
import {
	SublineBold,
	brandColors,
	mediaQueries,
	neutralColors,
	Flex,
	IconGIVBack24,
	IconSearch16,
} from '@giveth/ui-design-system';
import { useState, type FC } from 'react';
import { useIntl } from 'react-intl';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { TokenInfo } from './TokenInfo';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import CheckBox from '@/components/Checkbox';
import { useDonateData } from '@/context/donate.context';

export interface ISelectTokenModalProps extends IModal {
	tokens?: IProjectAcceptedToken[];
}

export const SelectTokenModal: FC<ISelectTokenModalProps> = props => {
	const { isAnimating, closeModal } = useModalAnimation(props.setShowModal);
	const { formatMessage } = useIntl();
	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Select a Token'
			headerTitlePosition='left'
			footer={
				<GIVbackWrapper>
					<Flex gap='8px' $alignItems='center'>
						<IconGIVBack24 color={brandColors.giv[500]} />
						<SublineBold>
							{formatMessage({
								id: 'label.givbacks_eligible_tokens',
							})}
						</SublineBold>
					</Flex>
				</GIVbackWrapper>
			}
		>
			<SelectTokenInnerModal {...props} />
		</Modal>
	);
};

const SelectTokenInnerModal: FC<ISelectTokenModalProps> = ({
	tokens,
	setShowModal,
}) => {
	const [hideZeroBalance, setHideZeroBalance] = useState(false);
	const { setSelectedOneTimeToken } = useDonateData();

	return (
		<>
			<Wrapper>
				<InputWrapper>
					<Input placeholder='Search name or paste an address'></Input>
					<SearchIconWrapper>
						<IconSearch16 color={neutralColors.gray[400]} />
					</SearchIconWrapper>
				</InputWrapper>
				<CheckBox
					label='Hide 0 balance tokens'
					onChange={e => {
						setHideZeroBalance(!hideZeroBalance);
					}}
					checked={hideZeroBalance}
					size={14}
				/>
				{tokens !== undefined && tokens.length > 0 ? (
					tokens.map(token => (
						<TokenInfo
							key={token.symbol}
							token={token}
							hideZeroBalance={hideZeroBalance}
							onClick={() => {
								setSelectedOneTimeToken(token);
								setShowModal(false);
							}}
						/>
					))
				) : (
					<div>No token supported on this chain</div>
				)}
			</Wrapper>
		</>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	padding: 12px 24px;
	gap: 12px;
	${mediaQueries.tablet} {
		width: 548px;
		max-height: 600px;
	}
`;

const GIVbackWrapper = styled.div`
	margin-top: 4px;
	padding: 12px 24px;
	background: ${neutralColors.gray[200]};
`;

const InputWrapper = styled.div`
	border-radius: 8px;
	border: 2px solid ${neutralColors.gray[300]};
	position: relative;
`;

const Input = styled.input`
	padding: 8px 16px;
	padding-right: 48px;
	width: 100%;
	border: none;
	outline: none;
	font-size: 16px;
	background: transparent;
	line-height: 24px;
`;

const SearchIconWrapper = styled.div`
	position: absolute;
	top: 8px;
	right: 12px;
	border-left: 1px solid ${neutralColors.gray[300]};
	padding: 2px;
	padding-left: 8px;
`;

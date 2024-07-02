import styled from 'styled-components';
import {
	Caption,
	SublineBold,
	brandColors,
	mediaQueries,
	neutralColors,
	Flex,
	P,
	IconGIVBack24,
} from '@giveth/ui-design-system';
import { type FC } from 'react';
import { useIntl } from 'react-intl';
import { IModal } from '@/types/common';
import { Modal } from '@/components/modals/Modal';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { TokenInfo } from './TokenInfo';
import { useDonateData } from '@/context/donate.context';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';

export interface ISelectTokenModalProps extends IModal {
	tokens?: IProjectAcceptedToken[];
}

export const SelectTokenModal: FC<ISelectTokenModalProps> = props => {
	const { isAnimating, closeModal } = useModalAnimation(props.setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitle='Select a Token'
			headerTitlePosition='left'
		>
			<SelectTokenInnerModal {...props} />
		</Modal>
	);
};

const SelectTokenInnerModal: FC<ISelectTokenModalProps> = ({
	tokens,
	setShowModal,
}) => {
	const { formatMessage } = useIntl();
	const { tokenStreams, setSelectedToken, project } = useDonateData();

	return (
		<>
			<Wrapper>
				<Title $medium>
					{formatMessage({
						id: 'label.superfluid_eligible_tokens',
					})}
				</Title>
				<TitleSubheader>
					{formatMessage({
						id: 'label.superfluid_eligible_tokens_description',
					})}
				</TitleSubheader>
				{tokens !== undefined && tokens.length > 0 ? (
					tokens.map(token => (
						<TokenInfo
							key={token.symbol}
							token={token}
							onClick={() => {
								// setSelectedToken({
								// 	token: token.underlyingToken,
								// 	balance:
								// 		balances[token.underlyingToken.symbol],
								// });
								setShowModal(false);
							}}
						/>
					))
				) : (
					<div>No token supported on this chain</div>
				)}
			</Wrapper>
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
		</>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	padding: 12px 24px;
	gap: 12px;
	${mediaQueries.tablet} {
		width: 548px;
	}
`;

const Title = styled(Caption)`
	text-align: left;
	padding-bottom: 1px;
	border-bottom: 1px solid ${neutralColors.gray[300]};
	color: ${neutralColors.gray[700]};
`;

const TitleSubheader = styled(P)`
	text-align: left;
	font-size: 0.75rem;
	font-style: italic;
	color: ${neutralColors.gray[800]};
`;

const GIVbackWrapper = styled.div`
	padding: 12px 24px;
	background: ${neutralColors.gray[200]};
`;

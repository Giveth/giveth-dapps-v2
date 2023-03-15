import {
	P,
	neutralColors,
	Title,
	GLink,
	brandColors,
	IconExternalLink,
	OutlineButton,
	IconGIVBack,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { Flex } from '../styled-components/Flex';
import { Modal } from './Modal';
import links from '@/lib/constants/links';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';

export const GIVBackExplainModal: FC<IModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { formatMessage } = useIntl();

	return (
		<Modal closeModal={closeModal} isAnimating={isAnimating}>
			<GIVBackExplainContainer>
				<TitleRow alignItems='center' justifyContent='center'>
					<IconGIVBack size={24} />
					<Title>
						{formatMessage({
							id: 'label.why_dont_i_have_givbacks',
						})}
					</Title>
				</TitleRow>
				<Desc>
					{formatMessage({
						id: 'label.givbacks_rewards_corresponding_to_the_current_round',
					})}
				</Desc>
				<LinksRow alignItems='center' justifyContent='center'>
					<GLink
						onClick={closeModal}
						as='a'
						target='_blank'
						href={links.GIVBACK_DOC}
					>
						<LinksRow justifyContent='center'>
							{formatMessage({
								id: 'label.read_more',
							})}
							<IconExternalLink
								size={16}
								color={'currentColor'}
							/>
						</LinksRow>
					</GLink>
				</LinksRow>
				<GotItButton
					label={formatMessage({ id: 'label.got_it' })}
					onClick={closeModal}
				/>
			</GIVBackExplainContainer>
		</Modal>
	);
};

const GIVBackExplainContainer = styled.div`
	padding: 24px 24px 24px;
	/* background-image: url('/images/stream1.svg'); */
	background-repeat: no-repeat;
	width: 570px;
	color: ${neutralColors.gray[100]};
`;

const TitleRow = styled(Flex)`
	gap: 16px;
	margin-bottom: 41px;
`;

const Desc = styled(P)`
	margin-bottom: 41px;
`;

const LinksRow = styled(Flex)`
	gap: 8px;
	color: ${brandColors.cyan[500]};
	margin-bottom: 24px;
`;

const GotItButton = styled(OutlineButton)`
	width: 316px;
	margin: 0 auto;
`;

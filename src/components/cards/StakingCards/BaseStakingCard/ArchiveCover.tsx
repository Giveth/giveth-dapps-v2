import {
	brandColors,
	GLink,
	IconInfoFilled24,
	OutlineButton,
	P,
} from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';

interface IArchiveCoverProps {
	isExploited?: boolean;
}

export const ArchiveCover: FC<IArchiveCoverProps> = ({ isExploited }) => {
	const [disableModal, setDisableModal] = useState<boolean>(true);
	const { formatMessage } = useIntl();

	return disableModal ? (
		<DisableModal>
			<DisableModalContent>
				<DisableModalImage>
					<IconInfoFilled24 />
				</DisableModalImage>
				<Flex flexDirection='column' justifyContent='space-evenly'>
					<DisableModalText weight={700}>
						{formatMessage({
							id: 'label.this_farm_has_ended',
						})}
					</DisableModalText>
					<DisableModalText>
						{isExploited ? (
							<>
								{formatMessage({
									id: 'label.an_exploit_has_removed_available_rewards',
								})}
								<DisableModalLink
									as='a'
									size='Big'
									target='_blank'
									href='https://forum.giveth.io/t/ending-givfarm-liquidity-incentives-programs-for-giv/872'
								>
									&nbsp;
									{formatMessage({
										id: 'label.this_forum_post',
									})}
									&nbsp;
								</DisableModalLink>
								{formatMessage({
									id: 'label.for_details',
								})}
							</>
						) : (
							formatMessage({
								id: 'label.harvest_your_rewards_and_remove_your_funds',
							})
						)}
					</DisableModalText>
					<DisableModalCloseButton
						label={formatMessage({
							id: 'label.got_it',
						})}
						onClick={() => setDisableModal(false)}
					/>
				</Flex>
			</DisableModalContent>
		</DisableModal>
	) : null;
};

const DisableModal = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	background: transparent;
	z-index: 10;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #00000070;
`;

const DisableModalContent = styled.div`
	display: flex;
	background: white;
	gap: 12px;
	border-radius: 12px;
	box-shadow: ${Shadow.Neutral[400]};
	max-width: 80%;
	height: 190px;
	padding: 16px 12px;
`;

const DisableModalText = styled(P)<{ weight?: number }>`
	color: ${brandColors.giv[500]};
	font-weight: ${props => (props.weight ? props.weight : 400)};
`;

const DisableModalLink = styled(GLink)`
	color: ${brandColors.pinky[500]};
`;

const DisableModalCloseButton = styled(OutlineButton)`
	border: none;
	color: ${brandColors.giv[500]};
	font-weight: 700;
	margin-left: auto;
	padding-right: 4px;

	&:hover {
		background-color: transparent;
	}
`;

const DisableModalImage = styled.div`
	width: 36px;
	color: ${brandColors.giv[500]};
`;

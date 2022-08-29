import {
	H4,
	H6,
	IconHelp,
	IconRocketInSpace32,
	neutralColors,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';
import { IModal } from '@/types/common';
import { Modal } from '../Modal';

import { useModalAnimation } from '@/hooks/useModalAnimation';
import { mediaQueries } from '@/lib/constants/constants';
import { IconWithTooltip } from '@/components/IconWithToolTip';
import { LockInfotooltip } from '../StakeLock/LockInfo';
import { Flex } from '@/components/styled-components/Flex';

interface IBoostModalProps extends IModal {}

const BoostModal: FC<IBoostModalProps> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal
			closeModal={closeModal}
			isAnimating={isAnimating}
			headerTitlePosition={'left'}
			headerTitle={'Boost'}
			headerIcon={<IconRocketInSpace32 />}
		>
			<BoostModalContainer>
				<ContentSection>
					<InfoPart>
						<Flex alignItems='baseline' gap='12px'>
							<H6>Total GIVpower</H6>
							<GIVpowerValue weight={700}>
								392,743.00
								<GIVpowerHelp>
									<IconWithTooltip
										icon={<IconHelp size={16} />}
										direction={'bottom'}
									>
										<LockInfotooltip>
											{/* TODO: add copy of this toast */}
											Your givpower
										</LockInfotooltip>
									</IconWithTooltip>
								</GIVpowerHelp>
							</GIVpowerValue>
						</Flex>
					</InfoPart>
				</ContentSection>
			</BoostModalContainer>
		</Modal>
	);
};

const BoostModalContainer = styled.div`
	width: 100%;
	${mediaQueries.tablet} {
		width: 480px;
	}
`;

const ContentSection = styled.div`
	padding: 24px;
`;

const InfoPart = styled.div`
	padding: 16px;
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	color: ${neutralColors.gray[700]};
`;

const GIVpowerValue = styled(H4)`
	position: relative;
`;

const GIVpowerHelp = styled.div`
	position: absolute;
	top: -16px;
	right: -20px;
	cursor: pointer;
	&:hover {
		color: ${neutralColors.gray[800]};
	}
`;

export default BoostModal;

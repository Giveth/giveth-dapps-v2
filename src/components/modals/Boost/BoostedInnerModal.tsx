import { Lead } from '@giveth/ui-design-system';
import useDetectDevice from '@/hooks/useDetectDevice';
import { ConfettiContainer, BoostedTitle } from './BoostModal.sc';
import ConfettiAnimation from '@/components/animations/confetti';
import type { FC } from 'react';

interface IBoostedModalProps {
	percentage: number;
}

const BoostedInnerModal: FC<IBoostedModalProps> = ({ percentage }) => {
	const { isMobile } = useDetectDevice();

	return (
		<div>
			<>
				<ConfettiContainer>
					<ConfettiAnimation size={isMobile ? 200 : 600} />
				</ConfettiContainer>
				<BoostedTitle>Project boosted!</BoostedTitle>
				<Lead>
					You boosted this project with {percentage}% of your
					GIVpower.
				</Lead>
			</>
		</div>
	);
};

export default BoostedInnerModal;

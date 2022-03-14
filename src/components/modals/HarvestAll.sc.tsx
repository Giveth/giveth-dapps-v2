import {
	brandColors,
	neutralColors,
	P,
	Lead,
	Button,
	H5,
	H6,
	Caption,
	Subline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import { Flex } from '../styled-components/Flex';

export const HarvestAllModalContainer = styled.div`
	width: 686px;
`;

export const USDAmount = styled(P)`
	margin-bottom: 22px;
	color: ${brandColors.deep[200]};
`;

export const HelpRow = styled(Flex)`
	gap: 8px;
	margin-bottom: 4px;
`;

export const RateRow = styled(Flex)`
	gap: 4px;
	margin-bottom: 32px;
`;

export const GIVRate = styled(Lead)`
	color: ${neutralColors.gray[100]};
`;

export const HarvestButton = styled(Button)`
	display: block;
	width: 316px;
	margin: 0 auto 16px;
`;

export const CancelButton = styled(Button)`
	width: 316px;
	margin: 0 auto 8px;
`;

export const SPTitle = styled(Flex)`
	margin-top: 12px;
	margin-bottom: 24px;
	color: ${neutralColors.gray[100]};
	margin-left: -24px;
`;

export const StakingPoolLabel = styled(H5)``;

export const StakingPoolSubtitle = styled(Caption)``;

export const StakePoolInfoContainer = styled.div`
	padding: 0 24px;
`;

export const HarvestAllDesc = styled(P)`
	text-align: justify;
	color: ${neutralColors.gray[100]};
	margin-bottom: 32px;
`;

export const NothingToHarvest = styled(H6)`
	text-align: center;
	color: ${neutralColors.gray[100]};
	margin-bottom: 32px;
`;

export const Pending = styled(Flex)`
	margin: 0 auto 16px;
	width: 100%;
	line-height: 50px;
	height: 50px;
	border: 2px solid ${neutralColors.gray[100]};
	border-radius: 48px;
	color: ${neutralColors.gray[100]};
	gap: 8px;
	justify-content: center;
	align-items: center;
	& > div {
		margin: 0 !important;
	}
`;

export const HarvestAllPending = styled(Pending)`
	max-width: 316px;
`;

export const TooltipContent = styled(Subline)`
	width: 200px;
`;

export const HarvestBoxes = styled.div`
	padding: 24px;
`;

import {
	H4,
	neutralColors,
	Button,
	brandColors,
	H5,
	OutlineButton,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';

export const StakeModalContainer = styled.div`
	padding-bottom: 24px;
	width: 100%;
	${mediaQueries.tablet} {
		width: 381px;
	}
`;

export const StakeModalTitle = styled(Flex)`
	margin-bottom: 16px;
`;

export const StakeModalTitleText = styled(H4)`
	margin-left: 54px;
	color: ${neutralColors.gray[100]};
`;

export const StakeInnerModalContainer = styled.div`
	padding: 0 24px;
`;

export const StyledOutlineButton = styled(OutlineButton)`
	width: 100%;
	margin-top: 32px;
	margin-bottom: 8px;
`;

export const StyledButton = styled(Button)`
	width: 100%;
	margin-top: 32px;
	margin-bottom: 8px;
`;

export const Pending = styled(Flex)`
	margin-top: 32px;
	margin-bottom: 8px;
	line-height: 46px;
	height: 46px;
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

export const CancelButton = styled(Button)`
	width: 100%;
`;

export const ToggleContainer = styled.div`
	padding: 16px 0px 0px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 10px;
`;

export const SectionTitle = styled(H5)`
	text-align: left;
	color: ${brandColors.giv[300]};
	padding-bottom: 8px;
	border-bottom: 1px solid ${brandColors.giv[500]};
	margin: 16px 0 8px;
`;

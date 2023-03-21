import styled from 'styled-components';
import { Container, neutralColors } from '@giveth/ui-design-system';

export const SectionContainer = styled.div`
	padding: 16px 24px;
`;

export const SettingsContainer = styled(Container)`
	margin-top: 70px;
	margin-bottom: 107px;
	background-color: ${neutralColors.gray[100]};
	border-radius: 8px;
	padding-left: 0;
	padding-right: 0;
`;

export const SectionSubtitle = styled.div`
	color: ${neutralColors.gray[700]};
	margin-top: 8px;
	margin-bottom: 7px;
`;

export const ItemsWrapper = styled.div<{ isOpen: boolean; height: number }>`
	height: ${({ isOpen, height }) => (isOpen ? height + 'px' : 0)};
	transition: height 1s ease-in-out;
	overflow: hidden;
	> div {
		> div:last-child {
			padding-bottom: 32px;
		}
	}
`;

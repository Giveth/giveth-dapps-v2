import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';

export interface ICardProps {
	activeIndex: number;
	index: number;
}

export const Card = styled.div<ICardProps>`
	position: absolute;
	width: 1120px;
	height: 582px;
	background: #3c14c5;
	padding: 57px 80px;
	background-image: url('/images/GIVGIVGIV.png');
	background-repeat: no-repeat;
	background-size: cover;
	margin: 10px auto;
	top: 50%;
	left: ${props => {
		if (props.index - props.activeIndex === 0) {
			return '50%';
		}
		if (props.index - props.activeIndex === 1) {
			return `calc(100% + ${1120 / 2 - 60}px)`;
		}
		if (props.index - props.activeIndex === -1) {
			return `-${1120 / 2 - 60}px;`;
		}
		return `${(props.index - props.activeIndex) * 100 + 50}%`;
	}};
	transform: translate(-50%, -60%);
	transition: left 0.3s ease-out;
	@media only screen and (max-width: 1360px) {
		width: 944px;
		left: ${props => {
			if (props.index - props.activeIndex === 0) {
				return '50%';
			}
			if (props.index - props.activeIndex === 1) {
				return `calc(100% + ${944 / 2 - 40}px)`;
			}
			if (props.index - props.activeIndex === -1) {
				return `-${944 / 2 - 40}px;`;
			}
			return `${(props.index - props.activeIndex) * 100 + 50}%`;
		}};
	}
	@media only screen and (max-width: 1120px) {
		width: 705px;
		left: ${props => {
			if (props.index - props.activeIndex === 0) {
				return '50%';
			}
			if (props.index - props.activeIndex === 1) {
				return `calc(100% + ${705 / 2 - 20}px)`;
			}
			if (props.index - props.activeIndex === -1) {
				return `-${705 / 2 - 20}px;`;
			}
			return `${(props.index - props.activeIndex) * 100 + 50}%`;
		}};
	}
`;

export const Header = styled.div`
	margin-bottom: 60px;
	@media only screen and (max-width: 1120px) {
		margin-bottom: 8px;
	}
`;

export const MaxGIV = styled.span`
	color: #fed670;
`;
export const ArrowButton = styled.div`
	width: 64px;
	height: 64px;
	background: #fed670;
	border-radius: 32px;
	background-image: url('/images/rarrow.svg');
	background-repeat: no-repeat;
	background-position: center;

	cursor: pointer;

	position: absolute;
	right: -32px;
	bottom: 48px;
`;

export const PreviousArrowButton = styled(ArrowButton)`
	background-color: #211985;
	left: -32px;
	transform: rotate(180deg);
`;

export const APRRow = styled(Flex)`
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-end;
	@media only screen and (max-width: 1360px) {
	}
	@media only screen and (max-width: 1120px) {
		flex-direction: column;
		align-items: center;
	}
`;

export const PoolCardContainer = styled.div`
	z-index: 1;
`;

export const PoolCardTitle = styled.div`
	font-size: 16px;
	padding-bottom: 12px;
	@media only screen and (max-width: 1120px) {
		padding-top: 8px;
		padding-bottom: 4px;
	}
`;

export const PoolCard = styled.div`
	width: 399px;
	// height: 164px;
	padding: 10px 30px;
	background: #211985;
	border-radius: 16px;
	z-index: 1;
	@media only screen and (max-width: 1360px) {
		width: 360px;
	}
`;

export const PoolItems = styled.div`
	padding: 12px 0;
`;

export const PoolItem = styled.div`
	font-size: 14px;
	height: 40px;
	line-height: 40px;
	display: flex;
	gap: 6px;
`;

export const PoolItemBold = styled.div`
	font-size: 16px;
	font-weight: 500;
	line-height: 40px;
	display: flex;
	gap: 6px;
`;

export const PoolCardFooter = styled.div`
	max-width: 500px;
	font-size: 12px;
	line-height: 18px;
	z-index: 1;
	margin: 16px 0;
	@media only screen and (max-width: 1120px) {
		text-align: center;
		margin: 16px auto;
	}
`;

export const ImpactCardLabel = styled.span`
	color: #cabaff;
`;

export const ImpactCardInput = styled.div`
	width: 360px;
`;

export const ImpactCard = styled.div`
	padding: 0;
	height: 180px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	@media only screen and (max-width: 1120px) {
		padding: 0;
		height: 140px;
	}
`;

export const MaxStakeGIV = styled(MaxGIV)`
	cursor: pointer;
`;

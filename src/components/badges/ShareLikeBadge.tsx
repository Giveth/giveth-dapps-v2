import { useIntl } from 'react-intl';
import styled from 'styled-components';
import {
	neutralColors,
	IconShare,
	brandColors,
	IconHeartOutline,
	ButtonText,
	IconHeartFilled,
} from '@giveth/ui-design-system';
import { Shadow } from '../styled-components/Shadow';
import { FlexCenter } from '@/components/styled-components/Flex';

const ShareLikeBadge = (props: {
	type: 'share' | 'like' | 'reward';
	active?: boolean;
	onClick: () => void;
	isSimple?: boolean | null;
	fromDonate?: boolean | null;
}) => {
	const { formatMessage } = useIntl();
	const { type, active, onClick, isSimple, fromDonate } = props;
	const isShare = type === 'share' || type === 'reward';
	const text =
		type === 'share'
			? formatMessage({ id: 'label.share' })
			: type === 'reward'
			? formatMessage({ id: 'label.share_and_get_rewarded' })
			: formatMessage({ id: 'label.like' });
	const icon = isShare ? (
		<IconShare
			color={
				fromDonate ? brandColors.pinky[500] : neutralColors.gray[500]
			}
		/>
	) : active ? (
		<IconHeartFilled color={brandColors.pinky[500]} />
	) : (
		<IconHeartOutline color={neutralColors.gray[500]} />
	);

	return (
		<Wrapper isSimple={isSimple} onClick={onClick}>
			{icon}
			{!isSimple && (
				<BadgeText size='small' fromDonate={fromDonate}>
					{text}
				</BadgeText>
			)}
		</Wrapper>
	);
};

const Wrapper = styled(FlexCenter)<{ isSimple?: boolean | null }>`
	height: 48px;
	gap: 6px;
	display: flex;
	align-items: center;
	padding: 0 12px;
	background: white;
	border-radius: 48px;
	box-shadow: ${Shadow.Neutral[500]};
	cursor: pointer;
	flex: 1;
	min-width: fit-content;
`;

const BadgeText = styled(ButtonText)<{ fromDonate?: boolean | null }>`
	color: ${props =>
		props.fromDonate ? brandColors.pinky[500] : neutralColors.gray[500]};
	text-transform: ${props => (props.fromDonate ? 'none' : 'uppercase')};
	margin: 0 auto;
`;

export default ShareLikeBadge;

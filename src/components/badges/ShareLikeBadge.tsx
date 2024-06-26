import { useIntl } from 'react-intl';
import styled from 'styled-components';
import {
	neutralColors,
	IconShare,
	brandColors,
	ButtonText,
	FlexCenter,
} from '@giveth/ui-design-system';
import { Shadow } from '../styled-components/Shadow';
const ShareLikeBadge = (props: {
	active?: boolean;
	onClick: () => void;
	isSimple?: boolean | null;
	fromDonate?: boolean | null;
}) => {
	const { formatMessage } = useIntl();
	const { active, onClick, isSimple, fromDonate } = props;

	return (
		<Wrapper onClick={onClick}>
			{
				<IconShare
					color={
						fromDonate
							? brandColors.pinky[500]
							: neutralColors.gray[700]
					}
				/>
			}
			{!isSimple && (
				<BadgeText size='small' $fromDonate={fromDonate}>
					{formatMessage({ id: 'label.share' })}
				</BadgeText>
			)}
		</Wrapper>
	);
};

const Wrapper = styled(FlexCenter)`
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

const BadgeText = styled(ButtonText)<{ $fromDonate?: boolean | null }>`
	color: ${props =>
		props.$fromDonate ? brandColors.pinky[500] : neutralColors.gray[700]};
	text-transform: ${props => (props.$fromDonate ? 'none' : 'uppercase')};
	margin: 0 auto;
`;

export default ShareLikeBadge;

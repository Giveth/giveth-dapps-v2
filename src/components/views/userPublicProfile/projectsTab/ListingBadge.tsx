import { semanticColors, SublineBold } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Badge } from '@/components/views/userPublicProfile/StyledComponents';

const ListingBadge = (props: { listed: boolean | null }) => {
	const { listed } = props;
	const Bull = () => <BulletPoint>&bull;</BulletPoint>;
	let color,
		title = '';

	if (listed) {
		color = semanticColors.jade;
		title = 'Listed';
	} else if (listed === null) {
		color = semanticColors.blueSky;
		title = 'Waiting for review';
	} else {
		color = semanticColors.golden;
		title = 'Not Listed';
	}

	return (
		<BadgeStyled mainColor={color}>
			<Bull />
			<SublineBold>{title}</SublineBold>
		</BadgeStyled>
	);
};

const BadgeStyled = styled(Badge)`
	display: flex;
	align-items: center;
`;

const BulletPoint = styled.div`
	font-size: 18px;
	margin: 0 5px 0 0;
	padding: 0;
`;

export default ListingBadge;

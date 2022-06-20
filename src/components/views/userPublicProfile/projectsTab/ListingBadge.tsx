import { semanticColors, SublineBold } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Badge } from '@/components/views/userPublicProfile/projectsTab/StyledComponents';

const ListingBadge = (props: { listed: boolean | null }) => {
	const { listed } = props;

	let color, title;

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
		<Badge mainColor={color}>
			<BulletPoint>&bull;</BulletPoint>
			<SublineBold>{title}</SublineBold>
		</Badge>
	);
};

const BulletPoint = styled.div`
	font-size: 18px;
	margin: 0 5px 0 0;
	padding: 0;
`;

export default ListingBadge;

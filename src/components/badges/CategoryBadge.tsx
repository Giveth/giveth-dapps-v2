import { neutralColors, Subline } from '@giveth/ui-design-system';
import styled from 'styled-components';

const CategoryBadge = ({ category }: { category: string }) => {
	return <Wrapper>{category}</Wrapper>;
};

const Wrapper = styled(Subline)`
	padding: 4px 10px;
	height: 26px;
	align-items: center;
	color: ${neutralColors.gray[600]};
	border: 1px solid ${neutralColors.gray[600]};
	border-radius: 48px;
	text-transform: uppercase;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export default CategoryBadge;

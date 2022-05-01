import Image from 'next/image';
import HeartGrayIcon from '/public/images/heart_gray.svg';
import HeartRedIcon from '/public/images/heart_red.svg';
import ShareIcon from '/public/images/share.svg';
import styled from 'styled-components';
import { neutralColors, GLink } from '@giveth/ui-design-system';
import { Shadow } from '../styled-components/Shadow';

const ShareLikeBadge = (props: {
	type: 'share' | 'like';
	active?: boolean;
	onClick?: () => void;
}) => {
	const { type, active, onClick } = props;
	const isShare = type === 'share';
	const text = isShare ? 'Share' : 'Like';
	const icon = isShare ? ShareIcon : active ? HeartRedIcon : HeartGrayIcon;
	return (
		<Wrapper onClick={onClick}>
			<Image src={icon} alt='badge icon' />
			<BadgeText size='Medium' className='mx-auto'>
				{text}
			</BadgeText>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	height: 40px;
	width: 125px;
	display: flex;
	align-items: center;
	padding: 0 18px;
	background: white;
	border-radius: 48px;
	box-shadow: ${Shadow.Neutral['400']};
	cursor: pointer;
`;

const BadgeText = styled(GLink)`
	color: ${neutralColors.gray[600]};
	font-weight: 500;
	margin: 0 auto;
`;

export default ShareLikeBadge;

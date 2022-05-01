import Image from 'next/image';
import githubIcon from '/public/images/github_purple.svg';
import twitterIcon from '/public/images/twitter_purple.svg';
import { brandColors, H5, Overline } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FlexCenter } from './styled-components/Flex';

interface IMember {
	name: string;
	title: string;
	image: string;
	socialGithub: string;
	socialTwitter: string;
}

const TeamCard = (props: { member: IMember }) => {
	const { name, title, image, socialGithub, socialTwitter } = props.member;
	return (
		<Wrapper>
			<Purple />
			<ImageContainer>
				<img src={image} alt={name} width='100%' />
			</ImageContainer>
			<Name>{name}</Name>
			<Overline color={brandColors.giv[800]}>{title}</Overline>
			<Icons>
				<a
					href={socialGithub}
					target='_blank'
					rel='noreferrer noopener'
				>
					<Image src={githubIcon} alt='github icon' />
				</a>
				<a
					href={socialTwitter}
					target='_blank'
					rel='noreferrer noopener'
				>
					<Image src={twitterIcon} alt='twitter icon' />
				</a>
			</Icons>
		</Wrapper>
	);
};

const Icons = styled(FlexCenter)`
	margin-top: 24px;
	gap: 16px;
`;

const Name = styled(H5)`
	margin-top: 24px;
	margin-bottom: 8px;
	color: ${brandColors.giv[700]};
`;

const ImageContainer = styled.div`
	width: 180px;
	height: 180px;
	overflow: hidden;
	border-radius: 50%;
	margin: -140px auto 0 auto;
`;

const Purple = styled.div`
	background: ${brandColors.giv[500]};
	height: 186px;
`;

const Wrapper = styled.div`
	width: 326px;
	height: 393px;
	border-radius: 12px;
	background: white;
	overflow: hidden;
`;

export default TeamCard;

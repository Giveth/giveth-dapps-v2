import styled from 'styled-components';
import {
	B,
	brandColors,
	Caption,
	IconChevronRight,
	IconGIVBack,
	IconRocketInSpace16,
	neutralColors,
	OutlineButton,
	P,
	semanticColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

const ProjectGIVbackToast = (props: any) => {
	const verified = true;
	const isOwner = true;
	const isOwnerVerified = verified && isOwner;
	const color = isOwnerVerified
		? semanticColors.golden[600]
		: neutralColors.gray[900];
	const { formatMessage } = useIntl();

	return (
		<Wrapper>
			<Content>
				<IconGIVBack color={color} size={24} />
				<Body>
					<Title color={color}>
						Get rewarded with up to 80% of your donation value!
					</Title>
					<Description>
						Donors to verified projects are rewarded with GIV. Boost
						this project to increase its rewards percentage and make
						it more visible on the projects page!
					</Description>
					<ExternalLink href={links.GIVBACK_DOC}>
						<LearnMore>
							{formatMessage({ id: 'label.learn_more' })}
							<IconChevronRight size={24} />
						</LearnMore>
					</ExternalLink>
				</Body>
			</Content>
			{verified && (
				<ButtonWrapper>
					<OutlineButton
						label='Boost'
						icon={<IconRocketInSpace16 />}
					/>
				</ButtonWrapper>
			)}
		</Wrapper>
	);
};

const LearnMore = styled(Caption)`
	display: flex;
	gap: 2px;
	color: ${brandColors.pinky[500]};
`;

const Description = styled(P)`
	margin: 4px 0;
	color: ${neutralColors.gray[900]};
`;

const Title = styled(B)<{ color: string }>`
	color: ${({ color }) => color};
`;

const Body = styled.div``;

const ButtonWrapper = styled.div`
	button {
		border-color: ${brandColors.giv[500]};
		flex-direction: row-reverse;
		color: ${brandColors.giv[500]};
		gap: 0;
		width: 194px;
		svg {
			margin-right: 8px;
		}
	}
`;

const Content = styled(Flex)`
	gap: 16px;
	> :first-child {
		flex-shrink: 0;
	}
`;

const Wrapper = styled(Flex)`
	justify-content: space-between;
	align-items: center;
	gap: 24px;
	padding: 16px;
	background: #ffffff;
	border-radius: 16px;
	margin-top: 12px;
`;

export default ProjectGIVbackToast;

import styled from 'styled-components';
import { Button, H4, IconChevronRight32 } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import ArcWithDot from '@/components/particles/ArcWithDot';
import Plus from '@/components/particles/Plus';

const JoinUsOnDiscord = () => {
	const { formatMessage } = useIntl();
	return (
		<Wrapper>
			<InnerWrapper>
				<H4 weight={700}>
					{formatMessage({ id: 'component.join_discord.title' })}
				</H4>
				<Body>
					{formatMessage({ id: 'component.join_discord.body' })}
				</Body>
				<ExternalLink href={links.DISCORD}>
					<Button
						label={
							formatMessage({ id: 'label.join_us_on' }) +
							' Discord'
						}
						buttonType='texty-primary'
						icon={<IconChevronRight32 />}
					/>
				</ExternalLink>
			</InnerWrapper>
			<ArcWrapper>
				<ArcWithDot />
			</ArcWrapper>
			<PlusWrapper>
				<Plus />
			</PlusWrapper>
		</Wrapper>
	);
};

const PlusWrapper = styled.div`
	position: absolute;
	right: 50px;
	bottom: 0;
`;

const Wrapper = styled.div`
	position: relative;
`;

const ArcWrapper = styled.div`
	position: absolute;
	top: -20px;
	left: -10px;
	rotate: 190deg;
`;

const Body = styled(H4)`
	margin: 16px 0;
`;

const InnerWrapper = styled.div`
	margin: 80px auto;
	max-width: 1280px;
	padding: 40px;
`;

export default JoinUsOnDiscord;

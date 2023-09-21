import styled from 'styled-components';
import {
	Button,
	H4,
	IconChevronRight32,
	neutralColors,
} from '@giveth/ui-design-system';
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
				<b>{formatMessage({ id: 'component.join_discord.title' })}</b>
				<Body>
					{formatMessage({ id: 'component.join_discord.body' })}
					<b> say-hi </b>
					{formatMessage({ id: 'component.join_discord.body_2' })}
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
	bottom: 60px;
`;

const InnerWrapper = styled.div`
	max-width: 1180px;
	padding: 120px 30px;
	margin: 0 auto;
	color: ${neutralColors.gray[900]};
`;

const Wrapper = styled(H4)`
	position: relative;
`;

const ArcWrapper = styled.div`
	position: absolute;
	top: 50px;
	left: -10px;
	rotate: 190deg;
`;

const Body = styled.div`
	margin: 16px 0;
`;

export default JoinUsOnDiscord;

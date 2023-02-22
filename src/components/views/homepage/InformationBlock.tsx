import styled from 'styled-components';
import {
	brandColors,
	Button,
	H3,
	IconChevronRight,
	Lead,
	semanticColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import TrazadoPinkIcon from 'public/images/particles/trazado-pink.svg';
import TrazadoGivIcon from 'public/images/particles/trazado-giv.svg';
import { Container } from '@/components/Grid';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

const InformationBlock = () => {
	const { formatMessage } = useIntl();

	return (
		<StyledContainer>
			<H3 weight={700}>
				{formatMessage({ id: 'page.home.philanthropy_needs_more' })}
			</H3>
			<br />
			<br />
			<Lead size='large'>
				{formatMessage({
					id: 'page.home.philanthropy_needs_more_desc_1',
				})}
			</Lead>
			<br />
			<Lead size='large'>
				{formatMessage({
					id: 'page.home.philanthropy_needs_more_desc_2',
				}) + ' '}
				<SpanStyled>
					{formatMessage({
						id: 'page.home.philanthropy_needs_more_desc_3',
					})}
				</SpanStyled>
			</Lead>
			<ExternalLink href={links.OUR_MISSION}>
				<ButtonStyled
					size='small'
					label={formatMessage({ id: 'label.learn_more' })}
					icon={<IconChevronRight />}
				/>
			</ExternalLink>
			<TrazadoGiv>
				<Image src={TrazadoGivIcon} alt='Trazado Giv' />
			</TrazadoGiv>
			<TrazadoPink>
				<Image src={TrazadoPinkIcon} alt='Trazado Pink' />
			</TrazadoPink>
			<QuarterCircle />
		</StyledContainer>
	);
};

const ButtonStyled = styled(Button)`
	margin-top: 24px;
	padding-right: 63px;
	padding-left: 63px;
`;

const TrazadoGiv = styled.div`
	position: absolute;
	top: 100px;
	right: 0;
`;

const TrazadoPink = styled.div`
	position: absolute;
	bottom: 35px;
	left: -30px;
`;

const QuarterCircle = styled.div`
	border-radius: 50%;
	border: 31px solid ${semanticColors.golden[400]};
	border-bottom-color: transparent;
	border-left-color: transparent;
	border-top-color: transparent;
	transform: rotate(-45deg);
	position: absolute;
	top: 55px;
	left: 170px;
`;

const SpanStyled = styled.span`
	color: ${brandColors.giv[600]};
`;

const StyledContainer = styled(Container)`
	position: relative;
	padding-top: 80px;
	padding-bottom: 80px;
`;

export default InformationBlock;

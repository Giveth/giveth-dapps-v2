import styled from 'styled-components';
import {
	Button,
	H3,
	IconChevronRight,
	Lead,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { Container } from '@giveth/ui-design-system';
import TrazadoPinkIcon from 'public/images/particles/trazado-pink.svg';
import TrazadoGivIcon from 'public/images/particles/trazado-giv.svg';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import { Relative } from '@/components/styled-components/Position';

const InformationBlock = () => {
	const { formatMessage } = useIntl();

	return (
		<Relative>
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
				<QuarterCircle />
			</StyledContainer>
			<TrazadoGiv>
				<Image src={TrazadoGivIcon} alt='Trazado Giv' />
			</TrazadoGiv>
			<TrazadoPink>
				<Image src={TrazadoPinkIcon} alt='Trazado Pink' />
			</TrazadoPink>
		</Relative>
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
	left: 0;
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
	color: ${neutralColors.gray[900]};
	font-weight: bold;
`;

const StyledContainer = styled(Container)`
	position: relative;
	padding-top: 80px;
	padding-bottom: 80px;
	color: ${neutralColors.gray[800]};
	> h3 {
		color: ${neutralColors.gray[900]};
	}
`;

export default InformationBlock;

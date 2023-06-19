import styled from 'styled-components';
import {
	Button,
	Caption,
	IconExternalLink16,
	IconPassport24,
	neutralColors,
	P,
	semanticColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { EPassportState, usePassport } from '@/hooks/usePassport';
import ExternalLink from '@/components/ExternalLink';
import { FlexCenter } from '@/components/styled-components/Flex';

const QFToast = () => {
	const { state } = usePassport();
	const isEligible = state === EPassportState.ELIGIBLE;
	const isNotEligible = state === EPassportState.NOT_ELIGIBLE;
	const { formatMessage } = useIntl();

	const color = isEligible
		? semanticColors.jade['500']
		: semanticColors.golden['700'];

	const title = formatMessage({
		id: `page.donate.passport_toast.title.${
			isEligible ? 'eligible' : 'non_eligible'
		}`,
	});

	const description = formatMessage({
		id: `page.donate.passport_toast.description.${
			isEligible
				? 'eligible'
				: isNotEligible
				? 'non_eligible'
				: 'not_connected'
		}`,
	});

	return (
		<Wrapper color={color}>
			<Title medium color={color}>
				{!isEligible && <IconPassport24 />}
				{title}
			</Title>
			<Description>
				{description}
				{!isEligible && <span> June 15</span>}
			</Description>
			<FlexCenter>
				<ExternalLink href={'/'}>
					<Button
						label={formatMessage({
							id: 'label.passport.link.go_to_passport',
						})}
						buttonType='primary'
						size='small'
						icon={<IconExternalLink16 />}
					/>
				</ExternalLink>
			</FlexCenter>
		</Wrapper>
	);
};

const Description = styled(P)`
	color: ${neutralColors.gray[800]};
	margin: 16px 0;
	> span {
		font-weight: 500;
	}
`;

const Title = styled(Caption)<{ color: string }>`
	color: ${props => props.color};
	display: flex;
	align-items: center;
	gap: 8px;
`;

const Wrapper = styled.div<{ color: string }>`
	margin: 24px 0;
	padding: 16px;
	text-align: left;
	color: ${neutralColors.gray[800]};
	border: 1px solid ${props => props.color};
	border-radius: 12px;
`;

export default QFToast;

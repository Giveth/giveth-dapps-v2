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
import { FlexCenter } from '@/components/styled-components/Flex';
import Routes from '@/lib/constants/Routes';
import InternalLink from '@/components/InternalLink';

const QFToast = () => {
	const { info } = usePassport();
	const { passportState, currentRound } = info;
	const isEligible = passportState === EPassportState.ELIGIBLE;
	const isNotEligible = passportState === EPassportState.NOT_ELIGIBLE;
	const { formatMessage, locale } = useIntl();

	const color = isEligible
		? semanticColors.jade['500']
		: semanticColors.golden['700'];

	const title = formatMessage({
		id: `page.donate.passport_toast.title.${
			isEligible ? 'eligible' : 'non_eligible'
		}`,
	});

	let description;
	const roundNumber = currentRound?.id;
	const endDate = new Date(currentRound?.endDate || '')
		.toLocaleString(locale || 'en-US', {
			day: 'numeric',
			month: 'short',
		})
		.replace(/,/g, '');

	if (isEligible) {
		description =
			formatMessage({
				id: 'page.donate.passport_toast.description.eligible',
			}) +
			' ' +
			roundNumber +
			' ' +
			formatMessage({
				id: 'label.ends_on',
			}) +
			' ' +
			endDate +
			formatMessage({
				id: 'page.donate.passport_toast.description.eligible_2',
			});
	} else {
		description = (
			<>
				{formatMessage({
					id: `page.donate.passport_toast.description.${
						isNotEligible ? 'non_eligible' : 'not_connected'
					}`,
				})}{' '}
				<span>{endDate}</span>
			</>
		);
	}

	return (
		<Wrapper color={color}>
			<Title medium color={color}>
				{!isEligible && <IconPassport24 />}
				{title}
			</Title>
			<Description>{description}</Description>
			<FlexCenter>
				<InternalLink href={Routes.Passport}>
					<Button
						label={formatMessage({
							id: 'label.passport.link.go_to_passport',
						})}
						buttonType='primary'
						size='small'
						icon={<IconExternalLink16 />}
					/>
				</InternalLink>
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

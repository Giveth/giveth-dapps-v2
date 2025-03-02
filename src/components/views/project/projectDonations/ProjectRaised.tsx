import styled from 'styled-components';
import { neutralColors, Subline } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';

export const ProjectRaised = ({
	roundDonorsCount,
}: {
	roundDonorsCount: number;
}) => {
	const { formatMessage } = useIntl();
	return (
		<div>
			<LightSubline>
				{formatMessage({
					id: 'label.raised_from',
				})}
			</LightSubline>
			<Subline style={{ display: 'inline-block' }}>
				&nbsp;{roundDonorsCount}
				&nbsp;
			</Subline>
			<LightSubline>
				{formatMessage(
					{
						id: 'label.contributors',
					},
					{
						count: roundDonorsCount,
					},
				)}
			</LightSubline>
		</div>
	);
};

const LightSubline = styled(Subline)`
	display: inline-block;
	color: ${neutralColors.gray[700]};
`;

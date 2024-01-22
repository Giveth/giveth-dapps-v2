import styled from 'styled-components';
import { B, H5, neutralColors } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';
import { useUserStreams } from '@/hooks/useUserStreams';

export const ActiveStreamsSection = () => {
	const tokenStream = useUserStreams();
	console.log('tokenStream', tokenStream);
	return (
		<Wrapper>
			<H5 weight={900}>My Active Streams</H5>
			<DonationTableContainer>
				<TableHeaderRow>
					<TableHeader>Current stream Balance</TableHeader>
					<TableHeader>Total Recurring Donations</TableHeader>
					<TableHeader>Projects</TableHeader>
					<TableHeader>Runs out in</TableHeader>
					<TableHeader>Actions</TableHeader>
				</TableHeaderRow>
			</DonationTableContainer>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 12px;
	background-color: ${neutralColors.gray[100]};
	padding: 26px 24px;
	border-radius: 12px;
`;

const DonationTableContainer = styled.div<{ myAccount?: boolean }>`
	display: grid;
	grid-template-columns: ${props =>
		props.myAccount
			? '1fr 4fr 1fr 1.5fr 1fr 1fr'
			: 'auto auto auto auto auto'};
	overflow: auto;
`;

const TableHeaderRow = styled.div`
	display: contents;
	& > * {
		background-color: ${neutralColors.gray[200]};
		padding: 22px 24px;
	}
	& > *:first-child {
		border-radius: 12px 0 0 12px;
	}
	& > *:last-child {
		border-radius: 0 12px 12px 0;
	}
`;

const TableHeader = styled(B)``;

import styled from 'styled-components';
import { FC } from 'react';
import {
	brandColors,
	Container,
	GLink,
	neutralColors,
} from '@giveth/ui-design-system';
import { Row } from './styled-components/Grid';
import Link from 'next/link';
import { useRouter } from 'next/router';

const tabs = [
	{
		label: 'Overview',
		href: '/',
	},
	{
		label: 'GIVgarden',
		href: '/givgarden',
	},
	{
		label: 'GIVfarm',
		href: '/givfarm',
	},
	{
		label: 'GIVbacks',
		href: '/givbacks',
	},
	{
		label: 'GIVstream',
		href: '/givstream',
	},
];

const Tabs: FC = () => {
	const { asPath } = useRouter();

	return (
		<>
			<LabelsContainer>
				<Container>
					<Row gap='16px'>
						{tabs.map((tab, idx) => (
							<Link key={idx} href={tab.href} passHref>
								<Label
									size='Big'
									isActive={asPath === tab.href}
								>
									{tab.label}
								</Label>
							</Link>
						))}
					</Row>
				</Container>
			</LabelsContainer>
		</>
	);
};

const labelsContainer = styled(Row)``;

interface ILabelProps {
	isActive: boolean;
}

const Label = styled(GLink)<ILabelProps>`
	width: 176px;
	padding: 12px;
	text-align: center;
	color: ${props =>
		props.isActive ? neutralColors.gray[100] : brandColors.deep[100]};
	background-color: ${props =>
		props.isActive ? brandColors.giv[600] : 'unset'};
	border: 1px solid ${brandColors.giv[600]};
	box-sizing: border-box;
	border-radius: 54px;

	cursor: pointer;
`;

const LabelsContainer = styled.div`
	padding: 42px 0;
`;

export default Tabs;

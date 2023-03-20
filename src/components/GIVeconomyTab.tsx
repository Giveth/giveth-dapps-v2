import styled from 'styled-components';
import { FC } from 'react';
import {
	brandColors,
	Container,
	GLink,
	neutralColors,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Flex } from './styled-components/Flex';
import { giveconomyTabs } from '@/lib/constants/Tabs';

const GIVeconomyTab: FC = () => {
	const { asPath } = useRouter();

	return (
		<Container>
			<LabelsContainer>
				<Flex gap='16px' justifyContent='space-between'>
					{giveconomyTabs.map((tab, idx) => (
						<Link key={idx} href={tab.href}>
							<Label size='Big' isActive={asPath === tab.href}>
								{tab.label}
							</Label>
						</Link>
					))}
				</Flex>
			</LabelsContainer>
		</Container>
	);
};

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
	padding: 32px 0 42px;
	width: 100%;
	overflow-x: auto;
`;

export default GIVeconomyTab;

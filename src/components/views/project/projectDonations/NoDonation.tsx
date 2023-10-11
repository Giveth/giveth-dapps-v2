import { ButtonLink, H1, H2, brandColors } from '@giveth/ui-design-system';
import Link from 'next/link';
import { FC } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { slugToProjectDonate } from '@/lib/routeCreators';
import { useProjectContext } from '@/context/project.context';
import { IQFRound } from '@/apollo/types/types';

interface INoDonation {
	selectedQF: IQFRound | null;
}

export const NoDonation: FC<INoDonation> = ({ selectedQF }) => {
	const { formatMessage } = useIntl();
	const { projectData, isActive } = useProjectContext();
	const { slug } = projectData || {};
	return (
		<Wrapper>
			{selectedQF && !selectedQF.isActive ? (
				<H2>There were no donations in this round.</H2>
			) : (
				<>
					<H1>Be the</H1>
					<H1 weight={700}>First</H1>
					<H1>to</H1>
					<H1 weight={700}>Donate</H1>
					{selectedQF && selectedQF.isActive && (
						<H1>in This Round</H1>
					)}
					{isActive ? (
						<Link href={slugToProjectDonate(slug || '')}>
							<DonateButton
								linkType='primary'
								label={formatMessage({ id: 'label.donate' })}
							/>
						</Link>
					) : (
						<DonateButton
							linkType='primary'
							label={formatMessage({ id: 'label.donate' })}
							disabled
						/>
					)}
				</>
			)}
		</Wrapper>
	);
};

const Wrapper = styled.div`
	padding: 60px;
	background-image: url('/images/backgrounds/giv-background.svg');
	color: ${brandColors.giv[500]};
	text-align: center;
	height: 100%;
`;

const DonateButton = styled(ButtonLink)`
	margin-top: 40px;
	display: inline-block;
	min-width: 260px;
`;

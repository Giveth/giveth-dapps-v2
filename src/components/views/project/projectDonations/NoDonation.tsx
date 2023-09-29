import { ButtonLink, H1, brandColors } from '@giveth/ui-design-system';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { slugToProjectDonate } from '@/lib/routeCreators';
import { useProjectContext } from '@/context/project.context';

export const NoDonation = () => {
	const { projectData } = useProjectContext();
	const { slug } = projectData || {};
	return (
		<Wrapper>
			<H1>Be the</H1>
			<H1 weight={700}>First</H1>
			<H1>to</H1>
			<H1 weight={700}>Donate</H1>
			<Link href={slugToProjectDonate(slug || '')}>
				<DonateButton linkType='primary' label='donate' />
			</Link>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	padding: 60px;
	background-image: url('/images/backgrounds/giv-background.svg');
	color: ${brandColors.giv[500]};
	text-align: center;
`;

const DonateButton = styled(ButtonLink)`
	margin-top: 40px;
	display: inline-block;
	min-width: 260px;
`;

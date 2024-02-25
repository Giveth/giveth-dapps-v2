import { H6, P, brandColors } from '@giveth/ui-design-system';
import React from 'react';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import styled from 'styled-components';
import { Flex } from '@giveth/ui-design-system';
import { TipListItem } from './common.styles';
import Routes from '@/lib/constants/Routes';

const DefaultTip = () => {
	const { formatMessage } = useIntl();
	return (
		<div>
			<Flex $flexDirection='column' gap='16px'>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.as_you_go_through_each_section_of_creating_your_project',
						})}
					</P>
				</TipListItem>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.you_get_what_you_put_in',
						})}
					</P>
				</TipListItem>
				<H6>
					{formatMessage({
						id: 'label.need_more_guidance',
					})}
				</H6>
				<TipListItem>
					<P>
						<CustomLink
							href={Routes.OnboardingProjects}
							target='_blank'
						>
							{formatMessage({
								id: 'label.weve_created_tutorials_to_guide_you',
							})}
						</CustomLink>
						{formatMessage({
							id: 'label.through_creating_a_project_getting_it_verified',
						})}
					</P>
				</TipListItem>
			</Flex>
		</div>
	);
};

const CustomLink = styled(Link)`
	color: ${brandColors.giv[500]};
`;

export default DefaultTip;

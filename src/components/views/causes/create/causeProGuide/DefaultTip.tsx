import { P, Flex, brandColors } from '@giveth/ui-design-system';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Link from 'next/link';
import styled from 'styled-components';
import { TipListItem } from './common.styles';

const DefaultTip = () => {
	const { formatMessage } = useIntl();
	return (
		<div>
			<Flex $flexDirection='column' gap='16px'>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.cause.whats_a_cause_desc',
						})}
					</P>
				</TipListItem>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.cause.whats_a_cause_desc_2',
						})}
					</P>
				</TipListItem>

				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.cause.whats_a_cause_desc_3',
						})}
					</P>
				</TipListItem>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.cause.whats_a_cause_desc_4',
						})}
					</P>
				</TipListItem>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.cause.whats_a_cause_desc_5',
						})}
					</P>
				</TipListItem>
				<TipListItem>
					<CustomLink>
						<FormattedMessage
							id='label.cause.whats_a_cause_desc_6'
							values={{
								link: chunks => (
									<Link
										href='https://docs.giveth.io/donation-agents'
										target='_blank'
									>
										{chunks}
									</Link>
								),
							}}
						/>
					</CustomLink>
				</TipListItem>
			</Flex>
		</div>
	);
};

export default DefaultTip;

const CustomLink = styled.div`
	font-size: 14px;
	font-weight: 400;
	line-height: 20px;
	color: ${brandColors.giv};

	a {
		color: ${brandColors.giv[500]};
	}
`;

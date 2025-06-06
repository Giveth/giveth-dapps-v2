import { P, Flex, brandColors } from '@giveth/ui-design-system';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Link from 'next/link';
import styled from 'styled-components';
import { TipListItem } from './common.styles';

const DescriptionTip = () => {
	const { formatMessage } = useIntl();
	return (
		<div>
			<Flex $flexDirection='column' gap='16px'>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.cause.create_description_examples_1',
						})}
					</P>
				</TipListItem>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.cause.create_description_examples_2',
						})}
					</P>
				</TipListItem>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.cause.create_description_examples_3',
						})}
					</P>
				</TipListItem>
				<TipListItem>
					<P>
						{formatMessage({
							id: 'label.cause.create_description_examples_4',
						})}
					</P>
				</TipListItem>
				<TipListItem>
					<CustomLink>
						<FormattedMessage
							id='label.cause.create_description_examples_5'
							values={{
								link1: chunks => (
									<Link
										href='https://docs.giveth.io/covenant'
										target='_blank'
									>
										{chunks}
									</Link>
								),
								link2: chunks => (
									<Link
										href='https://giveth.io/tos'
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

export default DescriptionTip;

const CustomLink = styled.div`
	font-size: 14px;
	font-weight: 400;
	line-height: 20px;
	color: ${brandColors.giv};

	a {
		color: ${brandColors.giv[500]};
	}
`;

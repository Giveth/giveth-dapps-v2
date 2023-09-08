import { Button, H3, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';
import ExternalLink from '@/components/ExternalLink';
import Routes from '@/lib/constants/Routes';
import NumberedItem from '@/components/views/landings/web3CryptoDonation/NumberedItem';
import numberedList from '@/components/views/landings/web3CryptoDonation/numberedItems';

const Body = () => {
	return (
		<>
			<LeadStyled size='large'>
				Did you know that Giveth is one of the very first platforms to
				accept crypto donations? Founded in 2016, we believe that Giveth
				is the best crypto donation platform in the world.
			</LeadStyled>
			<H3 weight={700}>Why?</H3>
			<br />
			<Lead size='large'>Here are a few reasons:</Lead>
			{numberedList.map(item => (
				<NumberedItem key={item.number} {...item} />
			))}
			<ButtonWrapper>
				<ExternalLink href={Routes.Projects}>
					<Button label='DONATE TO CRYPTO PROJECTS' />
				</ExternalLink>
			</ButtonWrapper>
		</>
	);
};

const ButtonWrapper = styled.div`
	margin: 50px auto;
	width: fit-content;
`;

const LeadStyled = styled(Lead)`
	margin: 80px 0;
`;

export default Body;

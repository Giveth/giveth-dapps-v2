import { Container } from '@giveth/ui-design-system';
import { PartnershipArray } from '@/content/Partnerships';

const OneHive = PartnershipArray.find(item => item.title.includes('1Hive'));
const Gnosis = PartnershipArray.find(item => item.title.includes('Gnosis'));
const CommonsStack = PartnershipArray.find(item =>
	item.title.includes('Commons Stack'),
);
const Gitcoin = PartnershipArray.find(item => item.title.includes('Gitcoin'));
const ShapeShift = PartnershipArray.find(item =>
	item.title.includes('ShapeShift'),
);

const PartnersArray = [OneHive, Gnosis, CommonsStack, Gitcoin, ShapeShift];

const HomePartners = () => {
	return <Container>HomePartners</Container>;
};

export default HomePartners;

import { H6, IconBulbOutline32, Flex } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import DefaultTip from '@/components/views/causes/create/causeProGuide/DefaultTip';
import TitleTip from '@/components/views/causes/create/causeProGuide/TitleTip';
import DescriptionTip from '@/components/views/causes/create/causeProGuide/DescriptionTip';
import BannerImageTip from '@/components/views/causes/create/causeProGuide/BannerImageTip';
import CategoryTip from '@/components/views/causes/create/causeProGuide/CategoryTip';
import MapTip from '@/components/views/causes/create/causeProGuide/MapTip';
import AddressesTip from '@/components/views/causes/create/causeProGuide/AddressesTip';
import { Card } from '@/components/views/create/proGuide/common.sc';
import { ECreateCauseSections } from '@/components/views/causes/create/types';

export interface ICauseTipProps {
	activeSection: ECreateCauseSections;
}

const CauseTip = ({ activeSection }: ICauseTipProps) => {
	const { formatMessage } = useIntl();
	const contentMap = {
		[ECreateCauseSections.default]: {
			title: formatMessage({
				id: 'label.cause.whats_a_cause',
			}),
			component: <DefaultTip />,
		},

		[ECreateCauseSections.name]: {
			title: 'A Captivating Title',
			component: <TitleTip />,
		},

		[ECreateCauseSections.description]: {
			title: 'Describing your Cause',
			component: <DescriptionTip />,
		},

		[ECreateCauseSections.categories]: {
			title: 'Choose the Right Category',
			component: <CategoryTip />,
		},

		[ECreateCauseSections.location]: {
			title: 'Put your Cause on the Map',
			component: <MapTip />,
		},

		[ECreateCauseSections.image]: {
			title: 'Adding a Banner Image',
			component: <BannerImageTip />,
		},

		[ECreateCauseSections.addresses]: {
			title: 'Receiving Funding',
			component: <AddressesTip />,
		},
	};

	return (
		<Card>
			<Flex gap='16px'>
				<IconBulbOutline32 />
				<H6 weight={700}>{contentMap[activeSection].title}</H6>
			</Flex>
			{contentMap[activeSection].component}
		</Card>
	);
};

export default CauseTip;

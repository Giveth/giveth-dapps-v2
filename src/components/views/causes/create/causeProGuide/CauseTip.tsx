import { H6, IconBulbOutline32, Flex } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import DefaultTip from '@/components/views/causes/create/causeProGuide/DefaultTip';
import TitleTip from '@/components/views/causes/create/causeProGuide/TitleTip';
import DescriptionTip from '@/components/views/causes/create/causeProGuide/DescriptionTip';
import BannerImageTip from '@/components/views/causes/create/causeProGuide/BannerImageTip';
import CategoryTip from '@/components/views/causes/create/causeProGuide/CategoryTip';
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
			title: formatMessage({
				id: 'label.cause.create_title',
			}),
			component: <TitleTip />,
		},

		[ECreateCauseSections.description]: {
			title: formatMessage({
				id: 'label.cause.create_description_examples',
			}),
			component: <DescriptionTip />,
		},

		[ECreateCauseSections.categories]: {
			title: formatMessage({
				id: 'label.cause.categories_right_category',
			}),
			component: <CategoryTip />,
		},

		[ECreateCauseSections.image]: {
			title: formatMessage({
				id: 'label.cause.add_an_image_to_your_cause',
			}),
			component: <BannerImageTip />,
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

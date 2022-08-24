import { SectionContainer } from './common/common.sc';
import SectionHeader from './common/SectionHeader';
import { SectionItem } from './common/SectionItem';

const GeneralSection = () => {
	return (
		<SectionContainer>
			<SectionHeader
				title='General'
				description='Modify all settings all at once'
			/>
			<SectionItem
				title='Email notifications'
				description='Turn on/off all email notifications'
				options={<div>hi</div>}
			/>
			<SectionItem
				title='Dapp notifications'
				description='Turn on/off all Dapp notifications'
				options={<div>hi</div>}
			/>
		</SectionContainer>
	);
};

export default GeneralSection;

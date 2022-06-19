import { GeneralMetatags } from '@/components/Metatag';
import FAQIndex from '@/components/views/FAQIndex';
import { faqMetatags } from '@/content/metatags';

const FAQRoute = () => {
	return (
		<div style={{ position: 'relative' }}>
			<GeneralMetatags info={faqMetatags} />
			<FAQIndex />
		</div>
	);
};

export default FAQRoute;

import JoinIndex from '@/components/views/join/JoinIndex';
import JoinEngage from '@/components/views/join/JoinEngage';
import { joinMetatags } from '@/content/metatags';
import { GeneralMetatags } from '@/components/Metatag';

const Join = () => {
	return (
		<>
			<GeneralMetatags info={joinMetatags} />
			<JoinIndex />
			<JoinEngage />
		</>
	);
};

export default Join;

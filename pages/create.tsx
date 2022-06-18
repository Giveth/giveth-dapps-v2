import { GeneralMetatags } from '@/components/Metatag';
import CreateView from '@/components/views/create/CreateIndex';
import { createProjectMetatags } from '@/content/metatags';

const CreateRoute = () => {
	return (
		<>
			<GeneralMetatags info={createProjectMetatags} />
			<CreateView />
		</>
	);
};

export default CreateRoute;

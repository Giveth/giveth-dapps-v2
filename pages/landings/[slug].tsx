import { GetServerSideProps } from 'next';

const SlugRoute = () => {
	return <div>Redirecting</div>;
};

//redirect all urls to lower case
export const getServerSideProps: GetServerSideProps = async context => {
	const { query } = context;
	const slug = query.slug as string;
	const newSlug = slug.toLowerCase();
	const newURL = '/landings/' + newSlug;

	let rules: any = {};
	if (slug && newSlug !== slug) {
		rules.redirect = {
			permanent: true,
			destination: newSlug,
		};
	}
	if (newSlug === slug) {
		rules.notFound = true;
	}

	console.log('ajab', {
		props: {},
		...rules,
	});

	return {
		props: {},
		...rules,
	};
};

export default SlugRoute;

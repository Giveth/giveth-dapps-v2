import { GetServerSideProps } from 'next';

const SlugRoute = () => {
	return <div>Redirecting</div>;
};

//redirect all urls to lower case
export const getServerSideProps: GetServerSideProps = async context => {
	const { query } = context;
	const slug = query.slug as string;
	const newSlug = slug.toLowerCase();
	const newURL = 'landings\\ ' + newSlug;

	return {
		props: {},
		redirect: slug && newSlug !== slug ? newURL : undefined,
		notFound: newSlug === slug,
	};
};

export default SlugRoute;

import ErrorsIndex from '@/components/views/Errors/ErrorsIndex';

function Error({ statusCode }) {
	return <ErrorsIndex statusCode='504' />;
}

Error.getInitialProps = ({ res, err }) => {
	// console.log('****ajab!!!!', res, err);
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return { statusCode };
};

export default Error;

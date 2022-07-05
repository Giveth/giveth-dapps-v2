import ErrorsIndex from '@/components/views/Errors/ErrorsIndex';

function Error({ statusCode }) {
	return statusCode ? (
		<ErrorsIndex statusCode='504' />
	) : (
		<p>An error occurred on client</p>
	);
}

Error.getInitialProps = ({ res, err }) => {
	// console.log('****ajab!!!!', res, err);
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return { statusCode };
};

export default Error;

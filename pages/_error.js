import ErrorsIndex from '@/components/views/Errors/ErrorsIndex';
import { transformGraphQLErrorsToStatusCode } from '@/helpers/requests';

function Error({ statusCode }) {
	return <ErrorsIndex statusCode={statusCode} />;
}

Error.getInitialProps = ({ res, err }) => {
	const statusCode = transformGraphQLErrorsToStatusCode(err.graphQLErrors);
	return { statusCode };
};

export default Error;

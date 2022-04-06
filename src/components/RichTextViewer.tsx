import ReactQuill from 'react-quill';
import styled from 'styled-components';
import { mediaQueries } from '@/utils/constants';

const RichTextViewer = (props: { content?: string }) => {
	return (
		<Wrapper>
			<ReactQuill value={props.content} readOnly theme='bubble' />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	img {
		max-width: 100%;
	}

	a {
		color: #007bff !important;
		&:hover {
			text-decoration: underline !important;
		}
	}

	${mediaQueries.tablet} {
		padding: 0 16px;
	}
`;

export default RichTextViewer;

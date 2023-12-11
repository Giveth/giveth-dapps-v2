import React, { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import styled from 'styled-components';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const StyledContainer = styled.div`
	position: relative;
	width: 100vm;
	height: 90vh;
	/* background-color: red; */
`;

const StyledPaginationContainer = styled.div`
	position: absolute;
	display: flex;
	justify-content: space-between;
	top: 50%;
	left: 20%;
	/* margin: 0px; */
	width: 60%;
`;

// const styles = StyleSheet.create({
// 	page: { backgroundColor: 'tomato' },
// 	section: { color: 'white', textAlign: 'center', margin: 30 },
// });

export default function Test() {
	const [numPages, setNumPages] = useState<number>(0);
	const [pageNumber, setPageNumber] = useState(1);

	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
		setNumPages(numPages);
		setPageNumber(1);
	}

	function changePage(offset: number) {
		setPageNumber(prevPageNumber => prevPageNumber + offset);
	}

	function previousPage() {
		changePage(-1);
	}

	function nextPage() {
		changePage(1);
	}

	// if (numPages === null) return;

	return (
		<StyledContainer>
			<Document
				file='/assets/GivethQF.Marketing.pdf'
				onLoadSuccess={onDocumentLoadSuccess}
				className='pdfDocument'
				loading=''
			>
				{Array.from(
					new Array(numPages),
					(el, index) =>
						index + 1 === pageNumber && (
							<Page
								key={`page_${index + 1}`}
								pageNumber={index + 1}
								renderTextLayer={false}
								scale={1.3}
								className='pdfPage'
							/>
						),
				)}
				{/* <Page pageNumber={pageNumber} renderTextLayer={false} /> */}
			</Document>
			<StyledPaginationContainer>
				{/* <p>
					Page {pageNumber || (numPages ? 1 : '--')} of{' '}
					{numPages || '--'}
				</p> */}
				<button
					type='button'
					// style={{ outline: 'none' }}
					disabled={pageNumber <= 1}
					onClick={previousPage}
				>
					{`<`}
				</button>
				<button
					type='button'
					disabled={pageNumber >= numPages}
					onClick={nextPage}
				>
					{`>`}
				</button>
			</StyledPaginationContainer>
		</StyledContainer>
	);
}

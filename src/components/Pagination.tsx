import { neutralColors, brandColors } from '@giveth/ui-design-system';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';
import { PaginationRow, PaginationItem } from './homeTabs/GIVstream.sc';

interface IPagination {
	setPage: Dispatch<SetStateAction<number>>;
	totalCount: number;
	currentPage: number;
	itemPerPage: number;
}

const Pagination = (props: IPagination) => {
	const { setPage, currentPage, totalCount, itemPerPage } = props;
	const [pages, setPages] = useState<any[]>([]);
	const [pageCount, setPageCount] = useState(0);

	useEffect(() => {
		const nop = Math.ceil(totalCount / itemPerPage);
		let _pages: Array<string | number> = [];
		const current_page = currentPage + 1;
		// Loop through
		for (let i = 1; i <= nop; i++) {
			// Define offset
			let offset = i == 1 || nop ? itemPerPage + 1 : itemPerPage;
			// If added
			if (
				i == 1 ||
				(current_page - offset <= i && current_page + offset >= i) ||
				i == current_page ||
				i == nop
			) {
				_pages.push(i);
			} else if (
				i == current_page - (offset + 1) ||
				i == current_page + (offset + 1)
			) {
				_pages.push('...');
			}
		}
		setPages(_pages);
		setPageCount(nop);
	}, [totalCount, currentPage, itemPerPage]);

	if (pageCount < 2) return null;
	return (
		<>
			{pageCount > 1 && (
				<PaginationRow justifyContent={'flex-end'} gap='16px'>
					<PaginationItem
						onClick={() => {
							if (currentPage > 0) setPage(page => page - 1);
						}}
						disable={currentPage == 0}
					>
						{'<  Prev'}
					</PaginationItem>
					{pages.map((p, id) => {
						return (
							<PaginationItem
								key={id}
								onClick={() => {
									if (!isNaN(+p)) setPage(+p - 1);
								}}
								isActive={+p - 1 === currentPage}
							>
								{p}
							</PaginationItem>
						);
					})}
					<PaginationItem
						onClick={() => {
							if (currentPage + 1 < pageCount)
								setPage(page => page + 1);
						}}
						disable={currentPage + 1 >= pageCount}
					>
						{'Next  >'}
					</PaginationItem>
				</PaginationRow>
			)}
		</>
	);
};

export default Pagination;

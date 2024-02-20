export const FETCH_MAIN_CATEGORIES = `
	query {
		mainCategories {
			title
			banner
			slug
			description
			categories {
				name
				value
				isActive
			}
		}
	}
`;

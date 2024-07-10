import { ICategory } from '@/apollo/types/types';

interface ICreateGoogleTagEvent {
	txHash: string;
	chainName: string;
	amount: number | undefined;
	projectId: string;
	projectName: string | undefined;
	categories?: ICategory[];
}

/**
 * Tracks a purchase event using Segment's analytics library to send a 'purchase' event to Google Tag Manager.
 *
 * @param {Object} params - The parameters for the event.
 * @param {string} params.txHash - The transaction hash.
 * @param {string} params.chainName - The name of the blockchain or chain.
 * @param {number | undefined} params.amount - The amount of the transaction in USD.
 * @param {string} params.projectId - The ID of the project.
 * @param {string | undefined} params.projectName - The name of the project.
 * @param {ICategory} [params.categories] - An optional array of category objects.
 *
 * This function logs the provided parameters and then sends a 'purchase' event to Segment.
 * The 'purchase' event includes the transaction details and the purchased item's details.
 * If categories are provided, up to 5 category levels are dynamically added to the item.
 */
const createGoogleTagEvent = ({
	txHash,
	chainName,
	amount,
	projectId,
	projectName,
	categories,
}: ICreateGoogleTagEvent) => {
	const item: any = {
		item_id: projectId,
		item_name: projectName,
		price: amount,
		quantity: 1,
	};

	// Add category fields if they exist
	if (categories && categories.length > 0) {
		categories.forEach((category, index) => {
			item[`item_category${index + 1}`] = category.name;
		});
	}

	const items = [item];

	// Send event data to tag manager
	window.analytics.track('purchase', {
		transaction_id: txHash,
		value: amount,
		currency: 'USD',
		coupon: chainName,
		items: items,
	});
};

export default createGooglelTagEvent;

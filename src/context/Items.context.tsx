import { createContext, ReactNode, useContext } from 'react';

interface IItemsContext {
	close: () => void;
}

const ItemsContext = createContext<IItemsContext>({
	close: () => console.log('close not initialed yet!'),
});

ItemsContext.displayName = 'ItemsContext';

export const ItemsProvider = (props: {
	children: ReactNode;
	close: () => void;
}) => {
	const { close, children } = props;

	return (
		<ItemsContext.Provider
			value={{
				close,
			}}
		>
			{children}
		</ItemsContext.Provider>
	);
};

export function useItemsContext() {
	const context = useContext(ItemsContext);

	if (!context) {
		throw new Error('Items context not found!');
	}

	return context;
}

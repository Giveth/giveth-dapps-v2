import {
	createContext,
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from 'react';

interface ITestContext {
	test: boolean;
	setTest: Dispatch<SetStateAction<boolean>>;
}

interface IProviderProps {
	children: ReactNode;
}

const TestContext = createContext<ITestContext>({
	setTest: () => {
		console.log('setTest Not Implemented Yet');
	},
	test: false,
});

TestContext.displayName = 'TestContext';

export const TestProvider: FC<IProviderProps> = props => {
	const [test, setTest] = useState(false);
	return (
		<TestContext.Provider value={{ test, setTest }}>
			{props.children}
		</TestContext.Provider>
	);
};

export const useTestData = () => {
	const context = useContext(TestContext);
	if (context === undefined) {
		throw new Error('useTestData must be used within a Provider');
	}
	return context;
};

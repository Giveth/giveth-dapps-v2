import React, { useEffect, useState } from 'react';
import AttributeItem from './AttributeItem';
interface IAttributeItem {
	trait_type: string;
	value: string;
}

interface IAttributeItems {
	id: number;
}

const AttributeItems = ({ id }: IAttributeItems) => {
	const [attributes, setAttributes] = useState<IAttributeItem[]>([]);

	useEffect(() => {
		const getPFPAttributes = async () => {
			const data = await fetch(`/json/pfp-metadata/${id}.json`);
			const JSONData = await data.json();
			setAttributes(JSONData.attributes ?? []);
		};
		getPFPAttributes();
	}, [id]);

	return (
		<>
			{attributes.length &&
				attributes?.map((attribute, index) => (
					<AttributeItem
						key={index}
						heading={attribute.trait_type}
						subtitle={attribute.value}
					/>
				))}
		</>
	);
};

export default AttributeItems;

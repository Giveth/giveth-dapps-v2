import React from 'react';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	ChartOptions,
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);
const options: ChartOptions<'line'> = {
	responsive: true,
	interaction: {
		mode: 'index' as const,
		intersect: false,
	},
	plugins: {
		title: {
			display: false,
		},
	},
	scales: {
		y: {
			type: 'linear' as const,
			display: true,
			position: 'left' as const,
			grid: {
				display: false,
			},
		},
		x: {
			grid: {
				display: false,
			},
		},
	},
};

const labels = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
];

const generateRandomNumberBetween = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

export const data = {
	labels,
	datasets: [
		{
			label: 'ETH',
			data: labels.map(() => generateRandomNumberBetween(0, 5)),
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgba(255, 99, 132, 0.5)',
			yAxisID: 'y',
			pointRadius: 0,
		},
	],
};

const GIVsavingsBalanceChart = () => {
	return (
		<div>
			<Line data={data} options={options} />
		</div>
	);
};

export default GIVsavingsBalanceChart;

import React from 'react';
import Lottie from 'react-lottie';

type MyProps = { size: any; animationData: any };
type MyState = { isStopped: boolean; isPaused: boolean };

export default class LottieControl extends React.Component<MyProps, MyState> {
	constructor(props: { size: any; animationData: any }) {
		super(props);
		this.state = { isStopped: false, isPaused: false };
	}

	render() {
		// const buttonStyle = {
		//   display: 'block',
		//   margin: '10px auto'
		// }

		const defaultOptions = {
			loop: true,
			autoplay: true,
			animationData: this.props?.animationData,
			rendererSettings: {
				preserveAspectRatio: 'xMidYMid slice',
			},
		};

		return (
			<div>
				<Lottie
					options={defaultOptions}
					height={this.props?.size || 400}
					width={this.props?.size || 400}
					isStopped={this.state.isStopped}
					isPaused={this.state.isPaused}
					isClickToPauseDisabled={true}
				/>
			</div>
		);
	}
}

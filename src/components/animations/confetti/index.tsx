import React from 'react'
import Lottie from 'react-lottie'
import animationData from './animation.json'

type MyProps = { size: any }
type MyState = { isStopped: boolean; isPaused: boolean }

export default class LottieControl extends React.Component<MyProps, MyState> {
  constructor(props: { size: any }) {
    super(props)
    this.state = { isStopped: false, isPaused: false }
  }

  render() {
    // const buttonStyle = {
    //   display: 'block',
    //   margin: '10px auto'
    // }

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    }

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
    )
  }
}

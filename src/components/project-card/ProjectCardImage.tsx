import { memo } from 'react'
import styled from 'styled-components'
import { isNoImg, noImgColor, noImgIcon } from '../../lib/helpers'

const ProjectCardImage = (props: { image?: string; cardRadius: string; cardWidth?: string }) => {
  const { image, cardRadius } = props

  if (isNoImg(image)) return <NoImg style={{ borderRadius: cardRadius }} />
  return <Img src={image} alt='project image' style={{ borderRadius: cardRadius }} />
}

const Img = styled.img`
  height: auto;
  width: 100%;
`

const NoImg = styled.div`
  background: ${noImgColor};
  width: 100%;
  height: 100%;
  background-image: url(${noImgIcon});
`

export default memo(ProjectCardImage)

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { FlexCenter } from '../styled-components/Grid'
import VerificationBadge from '../badges/VerificationBadge'
import grayHeartIcon from '/public//images/heart_gray.svg'
import redHeartIcon from '/public//images/heart_red.svg'
import shareIcon from '/public//images/share.svg'
import { IReaction } from '../../apollo/types/types'
import useUser from '@/context/UserProvider'
import { brandColors, Subline } from '@giveth/ui-design-system'
import { all } from 'deepmerge'
import { type } from 'os'
import styled from 'styled-components'

interface IBadgeWrapper {
  width?: string
}

interface IProjectCardBadges {
  reactions?: IReaction[]
  verified?: boolean
  traceable?: boolean
  isHover?: boolean
  likes?: number
  cardWidth?: string
}

const ProjectCardBadges = (props: IProjectCardBadges) => {
  const {
    state: { user }
  } = useUser()

  const [heartedByUser, setHeartedByUser] = useState(false)

  const { reactions, verified, isHover, traceable } = props
  const likes = reactions?.length

  useEffect(() => {
    if (user?.id) {
      const isHearted = !!reactions?.some(i => Number(i.userId) === Number(user.id))
      setHeartedByUser(isHearted)
    }
  }, [user])

  return (
    <BadgeWrapper>
      <div className='d-flex'>
        {verified && <VerificationBadge verified />}
        {traceable && <VerificationBadge trace />}
      </div>
      <div className='d-flex'>
        {Number(likes) > 0 && <LikeBadge>{likes}</LikeBadge>}
        <HeartWrap active={heartedByUser} isHover={isHover}>
          <Image src={heartedByUser ? redHeartIcon : grayHeartIcon} alt='heart icon' />
          <Image src={shareIcon} alt='share icon' />
        </HeartWrap>
      </div>
    </BadgeWrapper>
  )
}

const HeartWrap = styled(FlexCenter)<{ active?: boolean; isHover?: boolean }>`
  height: ${props => (props.isHover ? '72px' : '30px')};
  width: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border-radius: 56px;
  background: ${props => (props.active ? 'white' : brandColors.deep[800])};
  transition: all 0.3s ease;

  > span:nth-of-type(2) {
    display: ${props => (props.isHover ? 'unset' : 'none !important')};
  }
`

const LikeBadge = styled(Subline)`
  color: white;
  margin-right: 6px;
  margin-top: 7px;
`

const BadgeWrapper = styled.div<IBadgeWrapper>`
  width: 100%;
  position: absolute;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  padding: 16px;
`

export default ProjectCardBadges

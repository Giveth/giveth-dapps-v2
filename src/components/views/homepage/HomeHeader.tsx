import { useRouter } from 'next/router'
import { FlexCenter } from '@/components/styled-components/Grid'
import Routes from '@/lib/constants/Routes'
import { Arc } from '@/components/styled-components/Arc'
import { H1, brandColors, Button } from '@giveth/ui-design-system'
import styled from 'styled-components'

const HomeHeader = () => {
  const router = useRouter()
  return (
    <Wrapper>
      <H1 className='pt-5'>Welcome to the future of giving</H1>
      <Subtitle>Donate directly to social good projects with zero added fees.</Subtitle>
      <Button label='SEE PROJECTS' onClick={() => router.push(Routes.Projects)}></Button>
      <Button label='Create a Project' onClick={() => router.push(Routes.CreateProject)}></Button>
      <MustardArc />
    </Wrapper>
  )
}

const Subtitle = styled.div`
  font-size: 20px;
  line-height: 30px;
  margin: 23px 0;
  padding-bottom: 30px;
`

const MustardArc = styled(Arc)`
  border-width: 60px;
  border-color: ${brandColors.mustard[500]};
  top: 150px;
  left: -250px;
  width: 360px;
  height: 360px;
`

const Wrapper = styled(FlexCenter)`
  height: 650px;
  text-align: center;
  background: ${brandColors.giv[500]};
  color: white;
  flex-direction: column;
  z-index: 2;
  position: relative;
  background-image: url('/images/GIV_homepage.svg');
`

export default HomeHeader

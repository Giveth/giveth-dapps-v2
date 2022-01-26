import { Email_Input } from '@/components/styled-components/Input'
import { H3, brandColors, P, Button } from '@giveth/ui-design-system'
import styled from 'styled-components'

const HomeGetUpdates = () => {
  return (
    <Wrapper>
      <H3 color={brandColors.giv[500]}>Get the latest updates</H3>
      <P>Subscribe to our newsletter and get all updates straight to your mailbox!</P>
      <InputBox>
        <Email_Input placeholder='Your email address' />
        <Button label='SUBSCRIBE'></Button>
      </InputBox>
    </Wrapper>
  )
}

const InputBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
`

const Wrapper = styled.div`
  margin: 50px 150px;
`

export default HomeGetUpdates

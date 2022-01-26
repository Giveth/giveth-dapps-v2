import Image from 'next/image'
import TermsArray from '@/content/Terms.json'
import Accordion from '../Accordion'
import FlowerIcon from '/public//images/flower_terms.svg'
import styled from 'styled-components'
import { brandColors, D3, Lead } from '@giveth/ui-design-system'

const TermsIndex = () => {
  return (
    <>
      <FlowerContainer>
        <Image src={FlowerIcon} alt='flower' />
      </FlowerContainer>
      <Wrapper>
        <Title>Terms of use</Title>
        <Lead>Last updated December 23, 2020</Lead>
        <TermsContainer>
          {TermsArray.map(i => (
            <Accordion key={i.title} title={i.title} description={i.description} />
          ))}
        </TermsContainer>
      </Wrapper>
    </>
  )
}

const FlowerContainer = styled.div`
  position: absolute;
  right: 0;
`

const TermsContainer = styled.div`
  margin-top: 100px;
`

const Title = styled(D3)`
  color: ${brandColors.giv[700]};
  margin-bottom: 10px;
`

const Wrapper = styled.div`
  margin: 150px 270px;
  position: relative;
`

export default TermsIndex

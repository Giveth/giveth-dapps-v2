import TeamCard from '@/components/TeamCard'
import GivethTeam from '@/content/GivethTeam.json'
import { Lead, brandColors, H2 } from '@giveth/ui-design-system'
import styled from 'styled-components'

const AboutTeam = () => {
  return (
    <Wrapper>
      <Title>Meet our team</Title>
      <Caption>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lectus urna orci vel commodo.
      </Caption>
      <TeamCards>
        {GivethTeam.map(i => (
          <TeamCard key={i.name} member={i} />
        ))}
      </TeamCards>
    </Wrapper>
  )
}

const TeamCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
`

const Caption = styled(Lead)`
  color: ${brandColors.giv[800]};
  margin-bottom: 76px;
`

const Title = styled(H2)`
  color: ${brandColors.giv[700]};
  margin-bottom: 24px;
`

const Wrapper = styled.div`
  text-align: center;
`

export default AboutTeam

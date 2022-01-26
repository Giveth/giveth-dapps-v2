import { brandColors, H3, Lead } from '@giveth/ui-design-system'
import styled from 'styled-components'

const ProjectsNoResults = (props: { trySearch: () => void }) => {
  return (
    <Wrapper>
      <H3>No results</H3>
      <Content>We looked everywhere but did not find the project for your search.</Content>
      <TrySearch onClick={props.trySearch}>Try another search</TrySearch>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  text-align: center;
  margin: 128px auto;
  color: ${brandColors.deep[500]};
`

const TrySearch = styled(Lead)`
  color: ${brandColors.pinky[500]};
  cursor: pointer;
`

const Content = styled(Lead)`
  margin-top: 24px;
  margin-bottom: 8px;
`

export default ProjectsNoResults

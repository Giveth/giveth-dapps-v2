import { useQuery } from '@apollo/client'
import { FETCH_PROJECT_UPDATES } from '@/apollo/gql/gqlProjects'
import { IFetchProjectUpdates, IProjectBySlug } from '@/apollo/types/gqlTypes'
import ProjectTimeline from './ProjectTimeline'
import { IProjectUpdate } from '@/apollo/types/types'
import styled from 'styled-components'

const ProjectUpdates = (props: IProjectBySlug) => {
  const { id, creationDate } = props.project

  const { data } = useQuery(FETCH_PROJECT_UPDATES, {
    variables: { projectId: parseInt(id || ''), take: 100, skip: 0 }
  })
  const updates = data?.getProjectUpdates

  const sortedUpdates = updates
    ?.map((i: IFetchProjectUpdates) => i.projectUpdate)
    .sort((a: IProjectUpdate, b: IProjectUpdate) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  return (
    <Wrapper>
      {sortedUpdates?.map((i: IProjectUpdate) => (
        <ProjectTimeline key={i.id} projectUpdate={i} />
      ))}
      <ProjectTimeline creationDate={creationDate} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-left: 20px;
`

export default ProjectUpdates

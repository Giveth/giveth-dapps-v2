import { neutralColors, Subline } from '@giveth/ui-design-system'
import styled from 'styled-components'
import { ICategory } from '@/apollo/types/types'

const CategoryBadge = (props: { category: ICategory }) => {
  return <Wrapper>{props.category.name}</Wrapper>
}

const Wrapper = styled(Subline)`
  padding: 0 10px;
  height: 26px;
  display: flex;
  align-items: center;
  color: ${neutralColors.gray[600]};
  border: 1px solid ${neutralColors.gray[600]};
  border-radius: 48px;
  text-transform: uppercase;
`

export default CategoryBadge

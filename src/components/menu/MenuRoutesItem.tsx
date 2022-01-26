import Link from 'next/link'
import styled from 'styled-components'
import { brandColors } from '@giveth/ui-design-system'

const MenuRoutesItem = (props: { href: string; title: string; active: boolean }) => {
  const { href, title, active } = props
  return (
    <Link href={href} passHref>
      <RoutesItem className={active ? 'active' : ''}>{title}</RoutesItem>
    </Link>
  )
}

const RoutesItem = styled.a`
  padding: 7px 15px;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
  border-radius: 72px;
  :hover {
    color: ${brandColors.pinky[500]} !important;
  }
  &.active {
    background: ${brandColors.giv[100]};
    :hover {
      color: ${brandColors.deep[800]} !important;
    }
  }
`

export default MenuRoutesItem

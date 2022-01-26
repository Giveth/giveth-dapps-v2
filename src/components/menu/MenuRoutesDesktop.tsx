import { useRouter } from 'next/router'
import { Shadow } from '../styled-components/Shadow'
import { mediaQueries } from '../../lib/helpers'
import { menuRoutes } from './MenuRoutes'
import MenuRoutesItem from './MenuRoutesItem'
import { brandColors } from '@giveth/ui-design-system'
import styled from 'styled-components'

const MenuRoutesDesktop = () => {
  const router = useRouter()
  const activeMenu = menuRoutes.findIndex(i => router.pathname === i.href)

  return (
    <Wrapper>
      {menuRoutes.map((i, index) => {
        if (i.desktopOnly) {
          return (
            <MenuRoutesItem
              key={i.title}
              href={i.href}
              title={i.title}
              active={activeMenu === index}
            />
          )
        }
      })}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  box-shadow: ${Shadow.Dark[500]};
  padding: 0 10px;
  width: 408px;
  display: none;
  align-items: center;
  justify-content: space-between;
  border-radius: 72px;
  background: white;
  height: 48px;
  color: ${brandColors.deep[800]};

  ${mediaQueries.lg} {
    display: flex;
  }
`

export default MenuRoutesDesktop

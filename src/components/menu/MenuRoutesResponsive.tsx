import React, { useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/router'

import { FlexCenter } from '../styled-components/Grid'
import { Shadow } from '../styled-components/Shadow'
import { mediaQueries } from '../../lib/helpers'
import { menuRoutes } from './MenuRoutes'
import MenuRoutesItem from './MenuRoutesItem'
import drawerIcon from '/public//images/drawer_menu_purple.svg'
import { P, neutralColors } from '@giveth/ui-design-system'
import styled from 'styled-components'

const MenuRoutesResponsive = () => {
  const router = useRouter()
  const activeIndex = menuRoutes.findIndex(i => router.pathname === i.href)
  const activeMenu = menuRoutes[activeIndex]?.title
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Wrapper onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <DrawerClosed isOpen={isOpen}>
        <Image src={drawerIcon} alt='drawer menu' />
        {activeMenu && <P color={neutralColors.gray[900]}>{activeMenu}</P>}
      </DrawerClosed>
      <DrawerOpened isOpen={isOpen}>
        {menuRoutes.map((i, index) => (
          <MenuRoutesItem
            key={i.title}
            href={i.href}
            title={i.title}
            active={activeIndex === index}
          />
        ))}
      </DrawerOpened>
    </Wrapper>
  )
}

const DrawerClosed = styled(FlexCenter)<{ isOpen: boolean }>`
  gap: 11px;
  border-radius: 72px;
  box-shadow: ${props => (props.isOpen ? 'none' : Shadow.Dark['500'])};
  background: white;
  padding: 0 14px;
  height: 48px;
  cursor: pointer;
  z-index: 1080;
  position: relative;
`

const DrawerOpened = styled.div<{ isOpen: boolean }>`
  position: absolute;
  z-index: 1070;
  top: 20px;
  left: 0;
  width: 165px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 35px 15px 15px 15px;
  border-radius: 12px;
  box-shadow: ${Shadow.Dark['500']};
  transition: max-height 0.25s ease-in, opacity 0.25s ease-in;
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  opacity: ${props => (props.isOpen ? 1 : 0)};
  > * {
    opacity: ${props => (props.isOpen ? 1 : 0)};
    transition: opacity 0.25s ease-in;
    transition-delay: 0.25s;
  }
`

const Wrapper = styled.div`
  position: relative;

  ${mediaQueries.sm} {
    display: flex;
  }

  ${mediaQueries.lg} {
    display: none;
  }
`

export default MenuRoutesResponsive

import { semanticColors } from '@giveth/ui-design-system'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

const ExternalLink = (props: { children: ReactElement | string; href: string }) => {
  return (
    <StyledLink href={props.href} rel='noopener noreferrer' target='_blank'>
      {props.children}
    </StyledLink>
  )
}

const StyledLink = styled.a`
  color: ${semanticColors.blueSky[500]} !important;
`

export default ExternalLink

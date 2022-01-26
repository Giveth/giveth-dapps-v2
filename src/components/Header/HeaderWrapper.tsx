import { useGeneral } from '@/context/general.context'
import Header from './Header'

export const HeaderWrapper = () => {
  const { showHeader } = useGeneral()
  return showHeader ? <Header /> : null
}

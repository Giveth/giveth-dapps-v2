import { useGeneral } from '@/context/general.context'
import { Footer } from './Footer'

export const FooterWrapper = () => {
  const { showFooter } = useGeneral()
  return showFooter ? <Footer /> : null
}

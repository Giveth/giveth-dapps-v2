import { Footer } from '../Footer/Footer'
import { TabGIVbacksTop, TabGIVbacksBottom } from '../homeTabs/GIVbacks'

import Tabs from '../Tabs'

function GIVbackView() {
  return (
    <>
      <TabGIVbacksTop />
      <Tabs />
      <TabGIVbacksBottom />
    </>
  )
}

export default GIVbackView

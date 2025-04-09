import React from 'react'
import HeaderTab from '../../Components/HeaderTab/HeaderTab'
import Footer from '../../Components/Footer/Footer'
import Punchlist from '../../Components/Punchlist/Punchlist'
const PunchPage = () => {
  return (
    <div>
      <HeaderTab title='Punchlist' />
      <Punchlist />
      <Footer />
    </div>
  )
}

export default PunchPage

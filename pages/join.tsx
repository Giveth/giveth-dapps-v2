import Head from 'next/head'
import JoinIndex from '@/components/views/join/JoinIndex'
import JoinEngage from '@/components/views/join/JoinEngage'

const Join = () => {
  return (
    <>
      <Head>
        <title>Join | Giveth</title>
      </Head>
      <JoinIndex />
      <JoinEngage />
    </>
  )
}

export default Join

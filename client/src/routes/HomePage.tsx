import React, { useEffect } from 'react'
import Hero from '../components/common/HeroSection'
import Layout from '../Layout/PageLayout'

const Home: React.FC = () => {

  useEffect(() => {
    document.title = "Home | CvGen"
  }, [])


  return (
    <Layout>
      <Hero />
    </Layout>
  )
}

export default Home

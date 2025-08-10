import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const About: React.FC = () => {

  useEffect(() => {
    document.title = "About | CvGen"
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold text-gray-800">204</h1>
      <p className="text-2xl text-gray-600">Need to Develop About Page</p>
      <Link to="/" className="mt-4 inline-block px-4 py-2 text-white bg-red-500 rounded">
        Go Home
      </Link>
    </div>
  )
}

export default About
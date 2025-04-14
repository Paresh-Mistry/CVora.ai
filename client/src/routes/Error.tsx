import React from 'react'
import { Link } from 'react-router-dom'

export const Error:React.FC = () => {
  return (

        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <p className="text-2xl text-gray-600">Oops! Page not found.</p>
            <Link to="/" className="mt-4 inline-block px-4 py-2 text-white bg-red-500 rounded">
                Go Home
            </Link>
        </div>
  )
}

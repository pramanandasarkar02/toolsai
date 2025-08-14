import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-white border-b p-4">
      <ul className="flex flex-wrap gap-4 text-sm">
        {/* Main Pages */}
        <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
        <li><Link to="/feed" className="hover:text-blue-600">Feed</Link></li>
        <li><Link to="/explore" className="hover:text-blue-600">Explore</Link></li>
        <li><Link to="/prompt" className="hover:text-blue-600">Prompt</Link></li>
        <li><Link to="/chat" className="hover:text-blue-600">Chat</Link></li>
        
        {/* Company Pages */}
        <li><Link to="/company" className="hover:text-blue-600">Companies</Link></li>
        
        {/* User Pages */}
        <li><Link to="/favourite" className="hover:text-blue-600">Favorites</Link></li>
        
        {/* Auth Pages */}
        <li><Link to="/login" className="hover:text-blue-600">Login</Link></li>
        <li><Link to="/register" className="hover:text-blue-600">Register</Link></li>
        
        {/* Dashboard Links (typically conditionally rendered) */}
        <li><Link to="/admindashboard" className="hover:text-blue-600">Admin</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
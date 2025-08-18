import { useState } from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import ExplorePage from './pages/ExplorePage'
import CompanyPage from './pages/CompanyPage'
import CompanyDashBoard from './pages/CompanyDashBoard'
import AdminDashBoardPage from './pages/AdminDashBoardPage'
import Home from './pages/Home'
import FeedPage from './pages/FeedPage'
import PromptPage from './pages/PromptPage'
import ChatPage from './pages/ChatPage'
import SingleCompanyPage from './pages/SingleCompanyPage'
import SingleToolPage from './pages/SingleToolPage'
import UserProfilePage from './pages/UserProfilePage'
import FavouritePage from './pages/FavouritePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import Navbar from './components/Navbar'
import NotificationPage from './pages/NotificationPage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/explore" element={<ExplorePage />}/>
        <Route path="/prompt" element={<PromptPage />} />
        <Route path="/chat" element={<ChatPage />} />

        <Route path="/company" element={<CompanyPage />} />
        <Route path="/company/:slug" element={<SingleCompanyPage />} />
        <Route path="/tools/:slug" element={<SingleToolPage />} />

        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/favourite" element={<FavouritePage />} />

        <Route path="/companydashboard/:companyId" element={<CompanyDashBoard />} />
        <Route path="/admindashboard" element={<AdminDashBoardPage />} />

        <Route path='/notifications' element={<NotificationPage />}/>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />



        

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

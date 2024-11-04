import './App.css'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from './components/auth/Layout.jsx'
import AuthLogin from './pages/auth/Login.jsx'
import AuthRegister from './pages/auth/Register.jsx'
import AdminLayout from './components/admin-view/Layout.jsx'
import AdminDashboard from './pages/admin-view/Dashboard.jsx'
import { AdminProducts } from './pages/admin-view/Products.jsx'
import AdminOrders from './pages/admin-view/Orders.jsx'
import ShoppingLayout from './components/shopping-view/Layout.jsx'
import NotFound from './pages/not-found/index.jsx'
import ShoppingHome from './pages/shopping-view/Home.jsx'
import ShoppingListing from './pages/shopping-view/Listing.jsx'
import ShoppingCheckout from './pages/shopping-view/Checkout.jsx'
import ShoppingAccount from './pages/shopping-view/Account.jsx'
import { useState } from 'react'
import CheckAuth from './components/common/CheckAuth.jsx'
import UnauthPage from './pages/unauth-page/UnauthPage.jsx'
import { Button } from './components/ui/button.jsx'



function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // const [user, setUser] = useState({role: 'admin'})
  const [user, setUser] = useState({role: 'user'})

  return (
    <div className='flex flex-col overflow-hidden bg-white'>
      <Routes>
        <Route 
            path='/auth' 
            element={ 
                <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <AuthLayout />
                </CheckAuth> } 
        >
          <Route path='login' element={<AuthLogin />}/>
          <Route path='register' element={<AuthRegister />}/>
        </Route>

        <Route 
            path='/admin' 
            element={
                <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <AdminLayout />
                </CheckAuth>} 
        >
          <Route path='dashboard' element={<AdminDashboard />}/>
          <Route path='products' element={<AdminProducts />}/>
          <Route path='orders' element={<AdminOrders />}/>
        </Route>
        
        <Route 
            path='/shop' 
            element={
                <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <ShoppingLayout />
                </CheckAuth>
            } 
        >
          <Route path='home' element={<ShoppingHome />}/>
          <Route path='listing' element={<ShoppingListing />}/>
          <Route path='checkout' element={<ShoppingCheckout />}/>
          <Route path='account' element={<ShoppingAccount />}/>
        </Route>
        <Route path='/unauth-page' element={<UnauthPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App

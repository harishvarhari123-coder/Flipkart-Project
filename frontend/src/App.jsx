import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CategoryBar from './components/CategoryBar/CategoryBar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Payment from './pages/Payment/Payment';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';
import Orders from './pages/Orders/Orders';
import OrderDetail from './pages/OrderDetail/OrderDetail';
import RefundHistory from './pages/RefundHistory/RefundHistory';
import Invoice from './pages/Invoice/Invoice';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register'; 
import Profile from './pages/Profile/Profile';
import ManageAddresses from './pages/ManageAddresses/ManageAddresses';
import Contact from './pages/Contact/Contact';
import About from './pages/About/About';        
import Term from './pages/Term/Term';
import Policy from './pages/Policy/Policy';
import Wishlist from './pages/Wishlist/Wishlist';
import Coupons from './pages/Coupons/Coupons';

import Career  from './pages/Career/Career';
import HarikartStories from './pages/HarikartStories/HarikartStories';
import Press from './pages/Press/Press';
import Security from './pages/Security/Security';
import Shipping from './pages/Shipping/Shipping';
import Sitemap from './pages/Sitemap/Sitemap';
import Cancel from './pages/Cancel/Cancel';
import Faq from './pages/Faq/Faq';
import Privacy from './pages/Privacy/Privacy';
import Secure from './pages/Secure/Secure';
import Story from './pages/Story/Story';
import Blog from './pages/Blog/Blog';
import Fund from './pages/Fund/Fund';
import Follow from './pages/Follow/Follow';

import HelpCenter  from './pages/Helpcenter/Helpcenter';
import SSLTLSPage from './SecurityDetails/SSLTLSPage/SSLTLSPage';
import PCIDSSPage from './SecurityDetails/PCIDSSPage/PCIDSSPage';
import TwoFactorPage from './SecurityDetails/TwoFactorPage/TwoFactorPage';
import FraudMonitoringPage from './SecurityDetails/FraudMonitoringPage/FraudMonitoringPage';
import DataEncryptionPage from './SecurityDetails/DataEncryptionPage/DataEncryptionPage';
import InstantAlertsPage from './SecurityDetails/InstantAlertsPage/InstantAlertsPage';
import SecureBankingPage from './SecurityDetails/SecureBankingPage/SecureBankingPage';
import SecurityAuditsPage from './SecurityDetails/SecurityAuditsPage/SecurityAuditsPage';
import Explore from './SecurityDetails/Explore/Explore';
import EnableAlert from './SecurityDetails/EnableAlert/EnableAlert';
import ExploreSecurity from './SecurityDetails/ExploreSecurity/ExploreSecurity';
import EnableSecurity from './SecurityDetails/EnableSecurity/EnableSecurity';
import PCI from './SecurityDetails/Pci/Pci';
import SecurityStandards from './SecurityDetails/SecurityStandards/SecurityStandards';
import TwoStep from './SecurityDetails/TwoStep/TwoStep';
import LearnMore from './SecurityDetails/LearnMore/Learnmore';
import GetStarted from './SecurityDetails/GetStarted/GetStarted';
import Dashboard from './SecurityDetails/Dashboard/Dashboard';
import Audits from './SecurityDetails/Audits/Audits';
import AuditCTA from './SecurityDetails/AuditCTA/AuditCTA';
import Pics from './SecurityDetails/Pics/Pics';
import MethodDetailPage from './components/MethodDetailPage/MethodDetailPage';
import  Delivery from './pages/Delivery/Delivery';
import ScheduleCall from './pages/ScheduleCall/ScheduleCall';
import FarmToDoorstep from './pages/FarmToDoorstep/FarmToDoorstep';
import OurJourney from './pages/OurJourney/OurJourney';
import Partnership from './pages/Partnership/Partnership';



import './App.css';

import Chatbot from './pages/Chatbot/Chatbot';


function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isInvoicePage = location.pathname.startsWith('/invoice');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container">
      {!isInvoicePage && <Navbar />}
      {!isAuthPage && !isInvoicePage && <CategoryBar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/term" element={<Term />} />
          <Route path="/policy" element={<Policy />} />  
          <Route path="/career" element={<Career/>} />  
          <Route path="/harikartStories" element={<HarikartStories/>} />  
          <Route path="/faq" element={<Faq />} />
          <Route path="/security" element={<Security />} />
          <Route path="/sitemap" element={<Sitemap/>} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/Press" element={<Press />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/Privacy" element={<Privacy />} />
          <Route path="/Secure" element={<Secure />} />
          <Route path="/Story" element={<Story />} />
          <Route path="/Blog" element={<Blog />} />
          <Route path="/helpcenter" element={<HelpCenter />} />
          <Route path="/ssl-tls-encryption" element={<SSLTLSPage />} />
          <Route path="/pci-dss-compliant" element={<PCIDSSPage />} />
          <Route path="/two-factor-authentication" element={<TwoFactorPage />} />
          <Route path="/fraud-monitoring" element={<FraudMonitoringPage />} />
          <Route path="/data-encryption" element={<DataEncryptionPage />} />
          <Route path="/instant-alerts" element={<InstantAlertsPage />} />
          <Route path="/secure-banking" element={<SecureBankingPage />} />
          <Route path="/security-audits" element={<SecurityAuditsPage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/EnableAlert" element={<EnableAlert />} />
          <Route path="/ExploreSecurity" element={<ExploreSecurity />} />
          <Route path="/EnableSecurity" element={<EnableSecurity />} />
          <Route path="/pci" element={<PCI />} />
          <Route path="/SecurityStandards" element={<SecurityStandards />} />
          <Route path="/twostep" element={<TwoStep />} />
          <Route path="/learnmore" element={<LearnMore />} />
          <Route path="/getstarted" element={<GetStarted />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/audits" element={<Audits />} />
          <Route path="/AuditCTA" element={<AuditCTA />} />
          <Route path="/pics" element={<Pics/>} />
          <Route path="/methodetailpage" element={<MethodDetailPage />} />
          <Route path="/fund" element={<Fund/>} />
          <Route path="/delivery" element={<Delivery/>} />
          <Route path="/follow" element={<Follow/>} />
          <Route path="/schedulecall" element={<ScheduleCall/>} />
          <Route path="/ourjourney" element={<OurJourney/>}/>
          <Route path="refudhistory" element={<RefundHistory/>}/>
          <Route path="/getstarted" element={<GetStarted/>} />
          <Route path="/FarmToDoorstep" element={<FarmToDoorstep/>} />
          <Route path="/Coupons" element={<Coupons/>} />
          <Route path="/chatbot" element={<Chatbot/>} />
          <Route path="/Partnership" element={<Partnership/>} />



          <Route path="/cart" element={
            <ProtectedRoute><Cart /></ProtectedRoute>
          } />
          
          <Route path="/checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />
          
          <Route path="/payment" element={
            <ProtectedRoute><Payment /></ProtectedRoute>
          } />
          
          <Route path="/order-success" element={
            <ProtectedRoute><OrderSuccess /></ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute><Orders /></ProtectedRoute>
          } />
          
          <Route path="/order/:id" element={
            <ProtectedRoute><OrderDetail /></ProtectedRoute>
          } />
          
          <Route path="/refund-history" element={
            <ProtectedRoute><RefundHistory /></ProtectedRoute>
          } />
          
          <Route path="/invoice/:orderId" element={
            <ProtectedRoute><Invoice /></ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          <Route path="/addresses" element={
            <ProtectedRoute><ManageAddresses /></ProtectedRoute>
          } />

          <Route path="/wishlist" element={
            <ProtectedRoute><Wishlist /></ProtectedRoute>
          } />
        </Routes>
         
      </main>

      {!isAuthPage && !isInvoicePage && <Footer />}
    </div>
  );
}

export default App;
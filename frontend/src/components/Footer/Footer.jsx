import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, } from 'react-icons/fi';
import { FaWhatsapp } from "react-icons/fa";
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <h4>About</h4>
          <Link to="/contact">Contact Us</Link>
          <Link to="/about">About Us</Link>
          <Link to="/Career">Careers</Link>
          <Link to="/HarikartStories">Harikart Stories</Link>
          <Link to="/Press">Press</Link>
          <Link to="/Policy">Cookie Policy</Link>

        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <Link to="/Secure">Payments</Link>
          <Link to="/Shipping">Shipping</Link>
          <Link to="/Cancel">Cancellation &amp; Returns</Link>
          <Link to="/Faq">FAQ</Link>
          <Link to="/orders">Track Order</Link>
          <Link to="/blog">Blog</Link>
        </div>
        <div className="footer-col">
          <h4>Consumer Policy</h4>
          <Link to="/Policy">Return Policy</Link>
          <Link to="/Term">Terms Of Use</Link>
          <Link to="/security">Security</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/sitemap">Sitemap</Link>
          <Link to="/follow" className="footer-followme-link">
            ❤️ Follow Me
          </Link>
        </div>
        <div className="footer-col">
        <h4 style={{ marginRight: "69px" }}>
  Connect With Us
</h4>          <div className="footer-social">
            <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
              <FiFacebook />
            </a>
            <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <FiTwitter />
            </a>
            <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <FiInstagram />
            </a>
            <a href="https://youtube.com/yourchannel" target="_blank" rel="noopener noreferrer">
              <FiYoutube />
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
               <FaWhatsapp />
            </a>
          </div>
          <br />
          <h4>Mail Us</h4>
          <p>Harikart Internet Private Limited,<br />
            brindavanam colony,<br />
            Outer Ring Road, Cuddalore,607109</p>
        </div>
      </div>
      <hr className="footer-divider" />
      <div className="footer-bottom">
        <p>&copy; 2024-{new Date().getFullYear()} Harikart.com. All rights reserved.</p>
        <div className="footer-payment">
          <span>Payment methods:</span>
          <div className="footer-payment-icons">
            <span className="footer-payment-icon">VISA</span>
            <span className="footer-payment-icon">UPI</span>
            <span className="footer-payment-icon">MC</span>
            <span className="footer-payment-icon">COD</span>
            <span className="footer-payment-icon">EMI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

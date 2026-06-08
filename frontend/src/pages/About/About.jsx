import React from 'react';
import './About.css';
import mImg from "../../assets/m.jpeg";
import charuImg from "../../assets/charu.jpeg";
import thavaImg from "../../assets/thava.jpeg";
import harisImg from "../../assets/haris.jpeg";
import haranImg from "../../assets/haran.jpeg";
import joshImg from "../../assets/josh.jpeg";

import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-banner">
  <div className="about-banner-overlay"></div>

  <div className="about-banner-content">
    <h1 className="about-heading">About Us</h1>

    <p className="about-tagline">
      Transforming ideas into reality through innovation, dedication, and excellence
    </p>

    <div className="about-metrics">
      <div className="metric-card">
        <span className="metric-value">10+</span>
        <span className="metric-title">Years Experience</span>
      </div>

      <div className="metric-card">
        <span className="metric-value">500+</span>
        <span className="metric-title">Projects Delivered</span>
      </div>

      <div className="metric-card">
        <span className="metric-value">250+</span>
        <span className="metric-title">Happy Clients</span>
      </div>
    </div>
  </div>
</section>
      {/* Company Story */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2 className="section-title">Our Story</h2>
              <p className="story-paragraph">
                Founded in 2014, our journey began with a simple vision: to bridge the gap between technology and human experience. What started as a small team of passionate developers has grown into a full-service digital agency serving clients across the globe.
              </p>
              <p className="story-paragraph">
                Over the years, we've evolved with the ever-changing digital landscape, embracing new technologies and methodologies while staying true to our core values. From startups to Fortune 500 companies, we've partnered with diverse organizations to bring their digital visions to life.
              </p>
              <p className="story-paragraph">
                Today, we're proud to be recognized as industry leaders, not just for our technical expertise, but for our commitment to building lasting relationships and delivering solutions that make a real impact.
              </p>
            </div>
            <div className="story-image">
              <div className="image-placeholder">
                <span className="placeholder-icon">🚀</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-box">
              <div className="box-icon">🎯</div>
              <h3 className="box-title">Our Mission</h3>
              <p className="box-text">
                To empower businesses through innovative technology solutions that drive growth, enhance efficiency, and create meaningful connections with their audiences. We strive to deliver excellence in every project while fostering a culture of continuous learning and improvement.
              </p>
            </div>
            <div className="vision-box">
              <div className="box-icon">🔭</div>
              <h3 className="box-title">Our Vision</h3>
              <p className="box-text">
                To be the global leader in digital transformation, recognized for our innovative solutions, exceptional client service, and positive impact on communities. We envision a future where technology seamlessly enhances every aspect of business and life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title center">Our Core Values</h2>
          <p className="section-subtitle">The principles that guide everything we do</p>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3 className="value-title">Innovation</h3>
              <p className="value-description">
                We constantly push boundaries, exploring cutting-edge technologies and creative solutions to solve complex challenges. Innovation isn't just what we do—it's who we are.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">⭐</div>
              <h3 className="value-title">Excellence</h3>
              <p className="value-description">
                Quality is non-negotiable. From code to customer service, we maintain the highest standards in every aspect of our work, ensuring exceptional results every time.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3 className="value-title">Collaboration</h3>
              <p className="value-description">
                Great achievements come from great teamwork. We foster an environment of open communication, mutual respect, and shared success with our clients and team members.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🛡️</div>
              <h3 className="value-title">Integrity</h3>
              <p className="value-description">
                We build trust through transparency, honesty, and accountability. Our relationships are founded on ethical practices and genuine care for our clients' success.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎨</div>
              <h3 className="value-title">Creativity</h3>
              <p className="value-description">
                We believe every project is an opportunity to create something extraordinary. Our creative approach ensures unique, engaging solutions tailored to each client's needs.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3 className="value-title">Growth</h3>
              <p className="value-description">
                Continuous learning and improvement are at our core. We invest in our team's development and stay ahead of industry trends to deliver cutting-edge solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title center">Meet Our Team</h2>
          <p className="section-subtitle">The talented people driving our success</p>
          <div className="team-grid">
            <div className="team-member">
            <img
    src={harisImg}
    alt="MohanRaj Ramanujam"
    className="member-photo photo-2"
  />              <h3 className="member-name">Harishvar</h3>
              <p className="member-role">CEO & Founder</p>
              <p className="member-bio">
                With 15+ years in tech leadership, Harikart founded the company with a vision to revolutionize digital experiences.
              </p>
              <div className="member-social">
                <a href="https://www.linkedin.com/in/harishvar-k-b16a46365?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="social-link">in</a>
                <a href="https://www.naukri.com/job-listings-junior-software-engineer-dmart-bengaluru-0-to-1-years-020626005525?utmcampaign=androidjd&utmsource=share&src=sharedjd" className="social-link">nk</a>
              </div>
            </div>
            <div className="team-member">
  <img
    src={mImg}
    alt="MohanRaj Ramanujam"
    className="member-photo photo-2"
  />
  <h3 className="member-name">MohanRaj Ramanujam</h3>
  <p className="member-role">Chief Technology Officer</p>
  <p className="member-bio">
    MohanRaj leads our technical vision, bringing expertise in cloud architecture and scalable solutions.
  </p>
  <div className="member-social">
    <a href="https://www.linkedin.com/in/mohanraj-ramanujam-b119492b5?utm_source=share_via&utm_content=profile&utm_medium=member_android" className="social-link">in</a>
    <a href="*https://www.naukri.com/mnjuser/profile*" className="social-link">nk</a>
  </div>
</div>

            <div className="team-member">
            <img
    src={charuImg}
    alt="charu"
    className="member-photo photo-3"
  />             
   <h3 className="member-name">Devadharshini </h3>
              <p className="member-role">Head of Design</p>
              <p className="member-bio">
                Devadharshini creative vision shapes beautiful, user-centric designs that drive engagement and conversion.
              </p>
              <div className="member-social">
                <a href="https://www.linkedin.com/in/devadharshini-ravi-456446354" className="social-link">in</a>
                <a href="https://www.naukri.com/mnjuser/homepage" className="social-link">nk</a>
              </div>
            </div>
            <div className="team-member">
            <img
    src={thavaImg}
    alt="thava"
    className="member-photo photo-4"
  />
              <h3 className="member-name">Thavasi Lingam</h3>
              <p className="member-role">Lead Software Engineer</p>
              <p className="member-bio">
                Thavasi Lingam technical expertise and problem-solving skills ensure robust, efficient solutions for complex challenges.
              </p>
              <div className="member-social">
                <a href="https://www.linkedin.com/in/hariharan-a-a824bb258" className="social-link">in</a>
                <a href="https://www.naukri.com/mnj/dashboard?utm" className="social-link">nk</a>
              </div>
            </div>
            <div className="team-member">
            <img
    src={haranImg}
    alt="haran"
    className="member-photo photo-5"/>
             <h3 className="member-name">HariHaran</h3>
              <p className="member-role">Product Manager</p>
              <p className="member-bio">
                HariHaran bridges the gap between vision and execution, ensuring our products deliver maximum value.
              </p>
              <div className="member-social">
                <a href="https://www.linkedin.com/in/hariharan-a-a824bb258" className="social-link">in</a>
                <a href="https://www.linkedin.com/in/hariharan-a-a824bb258" className="social-link">nk</a>
              </div>
            </div>
            <div className="team-member">
            <img
    src={joshImg}
    alt="josh"
    className="member-photo photo-5"/>              <h3 className="member-name">Joshua Solomon</h3>
              <p className="member-role">Marketing Director</p>
              <p className="member-bio">
                Joshua crafts compelling narratives that connect our solutions with the clients who need them most.
              </p>
              <div className="member-social">
                <a href="#" className="social-link">in</a>
                <a href="#" className="social-link">tw</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title center">What We Do</h2>
          <p className="section-subtitle">Comprehensive solutions for your digital needs</p>
          <div className="services-grid">
            <div className="service-item">
              <div className="service-icon">💻</div>
              <h3 className="service-title">Web Development</h3>
              <p className="service-description">
                Custom websites and web applications built with modern frameworks, optimized for performance and user experience.
              </p>
            </div>
            <div className="service-item">
              <div className="service-icon">📱</div>
              <h3 className="service-title">Mobile App Development</h3>
              <p className="service-description">
                Native and cross-platform mobile applications that deliver seamless experiences on iOS and Android devices.
              </p>
            </div>
            <div className="service-item">
              <div className="service-icon">☁️</div>
              <h3 className="service-title">Cloud Solutions</h3>
              <p className="service-description">
                Scalable cloud infrastructure and migration services leveraging AWS, Azure, and Google Cloud Platform.
              </p>
            </div>
            <div className="service-item">
              <div className="service-icon">🎨</div>
              <h3 className="service-title">UI/UX Design</h3>
              <p className="service-description">
                Beautiful, intuitive interfaces designed with user research, wireframing, prototyping, and usability testing.
              </p>
            </div>
            <div className="service-item">
              <div className="service-icon">🔒</div>
              <h3 className="service-title">Cybersecurity</h3>
              <p className="service-description">
                Comprehensive security solutions including penetration testing, vulnerability assessments, and compliance consulting.
              </p>
            </div>
            <div className="service-item">
              <div className="service-icon">📊</div>
              <h3 className="service-title">Data Analytics</h3>
              <p className="service-description">
                Transform data into actionable insights with advanced analytics, business intelligence, and machine learning.
              </p>
            </div>
            <div className="service-item">
              <div className="service-icon">🌐</div>
              <h3 className="service-title">Networking Engineering</h3>
              <p className="service-description">
                Design, implement, and maintain secure and scalable network infrastructures, ensuring reliable connectivity and optimal performance across systems.
              </p>
            </div>
            <div className="service-item">
                <div className="service-icon">📣</div>
                <h3 className="service-title">Digital Marketing</h3>
                <p className="service-description">
                  Boost your online presence with targeted digital marketing strategies including SEO, social media marketing, content creation, and paid advertising campaigns.
                </p>
              </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="achievements-section">
        <div className="container">
          <h2 className="section-title center white">Our Achievements</h2>
          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-icon">🏆</div>
              <h3 className="achievement-title">Best Digital Agency 2023</h3>
              <p className="achievement-org">Tech Excellence Awards</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">⭐</div>
              <h3 className="achievement-title">Top Rated on Clutch</h3>
              <p className="achievement-org">4.9/5 Client Satisfaction</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">🌟</div>
              <h3 className="achievement-title">Innovation Award</h3>
              <p className="achievement-org">Industry Leaders Summit</p>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">💼</div>
              <h3 className="achievement-title">Best Workplace</h3>
              <p className="achievement-org">Great Place to Work Certified</p>
            </div>
            <div className="achievement-card">
            <div className="achievement-icon">🚀</div>
            <h3 className="achievement-title">Fastest Growing Software Industry</h3>
            <p className="achievement-org">Business Growth Awards 2024,2025</p>
          </div>

          <div className="achievement-card">
            <div className="achievement-icon">🎖️</div>
            <h3 className="achievement-title">Customer Choice Award</h3>
            <p className="achievement-org">Recognized by 500+ Happy Clients</p>
          </div>
          </div>
        </div>
      </section>
      <div className="grid-container">
  <div className="grid-item">Item 1</div>
  <div className="grid-item">Item 2</div>
  <div className="grid-item">Item 3</div>
  <div className="grid-item">Item 4</div>
</div>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Start Your Project?</h2>
          <p className="cta-text">
            Let's collaborate to turn your vision into reality. Our team is ready to bring your ideas to life with cutting-edge technology and creative excellence.
          </p>
          <div className="cta-btn-group">
            <Link to="/getstarted"> <button className="cta-btn-primary">Get Started</button></Link> 
             <Link to="/ScheduleCall"> <button className="cta-btn-secondary">Schedule a Call</button></Link> 
          </div>
        </div>
      </section>
    </div>
  );
}
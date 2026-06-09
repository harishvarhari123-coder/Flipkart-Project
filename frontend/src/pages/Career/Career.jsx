import React, { useState, useEffect, useRef } from 'react';
import './Career.css';

const Career = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    linkedin: '',
    portfolio: '',
    coverLetter: '',
    resume: null
  });

  const [submitted, setSubmitted] = useState(false);
  const topRef    = useRef(null);
  const nameRef   = useRef(null);

  // Scroll to top + autofocus on mount and after reset
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    nameRef.current?.focus();
  }, [submitted]);

  const positions = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'UI/UX Designer',
    'Product Manager',
    'Data Scientist',
    'DevOps Engineer',
    'Marketing Manager',
    'Sales Executive'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        linkedin: '',
        portfolio: '',
        coverLetter: '',
        resume: null
      });
    }, 3000);
  };

  return (
    <div className="career-container" ref={topRef}>
      <div className="career-header">
        <h1>Join Our Team</h1>
        <p>Be part of something extraordinary. We're looking for talented individuals who are passionate about innovation.</p>
      </div>

      <div className="career-benefits">
        <h2>Why Work With Us?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🚀</div>
            <h3>Growth Opportunities</h3>
            <p>Continuous learning and career advancement</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💼</div>
            <h3>Competitive Benefits</h3>
            <p>Health insurance, retirement plans, and more</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🌍</div>
            <h3>Remote Friendly</h3>
            <p>Flexible work arrangements and locations</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🎯</div>
            <h3>Innovative Projects</h3>
            <p>Work on cutting-edge technology</p>
          </div>
        </div>
      </div>

      <div className="career-form-section">
        <h2>Apply Now</h2>
        {submitted ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Application Submitted!</h3>
            <p>Thank you for your interest. We'll review your application and get back to you soon.</p>
          </div>
        ) : (
          <form className="career-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  ref={nameRef}
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="form-group">
                <label htmlFor="position">Position Applied For *</label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a position</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="experience">Years of Experience *</label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select experience</option>
                  <option value="fresher">Fresher (0 years)</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'year' : 'years'}
                    </option>
                  ))}
                  <option value="10+">10+ years</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn Profile</label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="portfolio">Portfolio/Website</label>
              <input
                type="url"
                id="portfolio"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="coverLetter">Cover Letter *</label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="resume">Upload Resume (PDF) *</label>
              <input
                type="file"
                id="resume"
                name="resume"
                onChange={handleFileChange}
                accept=".pdf"
                required
              />
              {formData.resume && (
                <span className="file-name">Selected: {formData.resume.name}</span>
              )}
            </div>

            <button type="submit" className="submit-btn">
              Submit Application
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Career;
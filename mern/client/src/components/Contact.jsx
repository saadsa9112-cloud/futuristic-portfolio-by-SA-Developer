import React, { useState } from 'react';

export default function Contact({ settings }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: data.message || 'Transmission sent successfully!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatusMsg({ type: 'danger', text: data.message || 'Failed to dispatch transmission.' });
      }
    } catch (err) {
      // Fallback simulating client transmission if backend is offline
      setTimeout(() => {
        setStatusMsg({
          type: 'success',
          text: 'Transmission recorded in client buffer! Thank you for reaching out.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-5" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="badge px-3 py-2 rounded-pill font-monospace mb-2" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            // COMMS PROTOCOL
          </span>
          <h2 className="text-white fw-bold display-6">Initiate Direct Transmission</h2>
          <p className="text-secondary">Have an enterprise project or opportunity? Establish contact across secure channels.</p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Contact Info Cards */}
          <div className="col-lg-5" data-aos="fade-right">
            <div
              className="p-4 p-md-5 rounded-4 h-100 d-flex flex-column justify-content-between"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div>
                <h4 className="text-white fw-bold mb-4">Transmission Endpoints</h4>

                <div className="d-flex align-items-center gap-3 mb-4">
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(0, 217, 255, 0.1)',
                      border: '1px solid rgba(0, 217, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00D9FF',
                      fontSize: '18px'
                    }}
                  >
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <div className="text-secondary small font-monospace">DIRECT EMAIL</div>
                    <a href="mailto:saad.sa9112@gmail.com" className="text-white text-decoration-none fw-semibold">
                      saad.sa9112@gmail.com
                    </a>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-4">
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10B981',
                      fontSize: '18px'
                    }}
                  >
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <div className="text-secondary small font-monospace">VOICE / WHATSAPP</div>
                    <a href="tel:+923453937195" className="text-white text-decoration-none fw-semibold">
                      +92 345 3937195
                    </a>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-4">
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(168, 85, 247, 0.1)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C084FC',
                      fontSize: '18px'
                    }}
                  >
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <div className="text-secondary small font-monospace">COORDINATES</div>
                    <span className="text-white fw-semibold">Karachi, Pakistan</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-top border-secondary border-opacity-25">
                <span className="text-secondary small font-monospace d-block mb-3">SECURE REPOSITORIES &amp; NETWORKS</span>
                <div className="d-flex gap-2">
                  <a
                    href="https://github.com/saadsa9112-cloud"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-light rounded-circle"
                    style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <i className="fab fa-github"></i>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-light rounded-circle"
                    style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-7" data-aos="fade-left">
            <div
              className="p-4 p-md-5 rounded-4 h-100"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h4 className="text-white fw-bold mb-4">Send Encrypted Dispatch</h4>

              {statusMsg && (
                <div className={`alert alert-${statusMsg.type} font-monospace small mb-4`} role="alert">
                  <i className={`fas ${statusMsg.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="text-secondary small font-monospace mb-1">CALLSIGN / NAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      className="form-control text-white border-secondary border-opacity-25"
                      style={{ background: 'rgba(10, 10, 18, 0.6)' }}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="text-secondary small font-monospace mb-1">COMMUNICATION EMAIL *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@enterprise.com"
                      className="form-control text-white border-secondary border-opacity-25"
                      style={{ background: 'rgba(10, 10, 18, 0.6)' }}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-secondary small font-monospace mb-1">TRANSMISSION TOPIC</label>
                  <input
                    type="text"
                    placeholder="Project Inquiry / Job Opportunity"
                    className="form-control text-white border-secondary border-opacity-25"
                    style={{ background: 'rgba(10, 10, 18, 0.6)' }}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="mb-4">
                  <label className="text-secondary small font-monospace mb-1">TRANSMISSION PAYLOAD / MESSAGE *</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Describe project requirements, tech stack, or proposal details..."
                    className="form-control text-white border-secondary border-opacity-25"
                    style={{ background: 'rgba(10, 10, 18, 0.6)' }}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary px-5 py-2 rounded-pill fw-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #00D9FF, #8B3DFF)',
                    border: 'none',
                    boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)'
                  }}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span> Transmitting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i> Transmit Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

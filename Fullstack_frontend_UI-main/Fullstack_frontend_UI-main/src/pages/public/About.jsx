import '../pages.css';

export default function About() {
  return (
    <div className="page-container">
      <div className="container">
        <h1 style={{ color: '#d4af37', marginTop: '1rem', marginBottom: '1rem' }}>About OrganicSiri</h1>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', lineHeight: '1.8', color: '#555' }}>
          <h2 style={{ color: '#27ae60' }}>Our Mission</h2>
          <p>
            At OrganicSiri, we are committed to bringing fresh, organic, and sustainably grown products directly from farmers to your table. 
            Our mission is to make organic living accessible, affordable, and convenient for everyone.
          </p>

          <h2 style={{ color: '#27ae60' }}>Who We Are</h2>
          <p>
            Founded in 2023, OrganicSiri started as a small initiative to bridge the gap between organic farmers and conscious consumers. 
            Today, we are a thriving marketplace connecting thousands of farmers with health-conscious families across the nation.
          </p>

          <h2 style={{ color: '#27ae60' }}>What We Stand For</h2>
          <ul style={{ fontSize: '1.1rem', color: '#555' }}>
            <li>✅ <strong>Quality:</strong> Every product is hand-picked and verified for quality.</li>
            <li>🌱 <strong>Sustainability:</strong> We support eco-friendly farming practices.</li>
            <li>💚 <strong>Fair Trade:</strong> We ensure farmers get fair prices for their produce.</li>
            <li>🚚 <strong>Freshness:</strong> Direct from farm to your doorstep in 24 hours.</li>
            <li>🤝 <strong>Community:</strong> Building a community of health-conscious consumers.</li>
          </ul>

          <h2 style={{ color: '#27ae60' }}>Our Process</h2>
          <p>
            Our farmers follow strict organic farming guidelines. Once harvested, products are stored in optimal conditions 
            and delivered fresh to your home. We conduct quality checks at every stage to ensure you receive the best.
          </p>

          <h2 style={{ color: '#27ae60' }}>Contact Us</h2>
          <p>
            Have questions? We'd love to hear from you!<br />
            Email: info@organicsiri.com<br />
            Phone: +1 (555) 123-4567<br />
            Address: 123 Organic Lane, Nature City, NC 12345
          </p>
        </div>
      </div>
    </div>
  );
}

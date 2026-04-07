import '../pages.css';

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: 'Benefits of Eating Organic',
      date: '2026-02-15',
      excerpt: 'Discover why organic food is better for your health and the environment.',
      content: 'Organic farming practices avoid synthetic pesticides and fertilizers, resulting in cleaner, healthier food...'
    },
    {
      id: 2,
      title: 'Supporting Local Farmers',
      date: '2026-02-10',
      excerpt: 'Learn how buying from local farmers can make a real difference.',
      content: 'By purchasing directly from farmers, you ensure they receive fair compensation while enjoying farm-fresh produce...'
    },
    {
      id: 3,
      title: 'Seasonal Eating Guide',
      date: '2026-02-05',
      excerpt: 'A comprehensive guide to eating foods in their peak season.',
      content: 'Seasonal eating not only gives you the freshest produce but also supports sustainable farming practices...'
    },
    {
      id: 4,
      title: 'Simple Organic Recipes',
      date: '2026-01-28',
      excerpt: 'Easy recipes using fresh organic ingredients.',
      content: 'From salads to soups to smoothies, discover delicious ways to use your organic produce...'
    },
  ];

  return (
    <div className="page-container">
      <div className="container">
        <h1 style={{ color: '#d4af37', marginTop: '1rem', marginBottom: '1rem' }}>OrganicSiri Blog</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {blogPosts.map(post => (
            <div key={post.id} style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <p style={{ color: '#27ae60', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h3 style={{ color: '#2c3e50', margin: '0 0 0.5rem 0' }}>{post.title}</h3>
              <p style={{ color: '#555', margin: '0 0 1rem 0', lineHeight: '1.6' }}>{post.excerpt}</p>
              <button style={{
                background: '#27ae60',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                Read More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

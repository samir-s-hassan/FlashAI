import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ViewCollectionsPage = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    // TODO: Fetch collections from DynamoDB
    // For now, we'll use mock data
    setCollections([
      { id: '1', name: 'Biology 101', cardCount: 20 },
      { id: '2', name: 'World History', cardCount: 15 },
      { id: '3', name: 'Mathematics', cardCount: 30 },
    ]);
  }, []);

  return (
    <div className="collections-page">
      <h1>Your Flashcard Collections</h1>
      <div className="collections-grid">
        {collections.map(collection => (
          <div key={collection.id} className="collection-card">
            <h2>{collection.name}</h2>
            <p>{collection.cardCount} cards</p>
            <Link to={`/collection/${collection.id}`}>View Collection</Link>
          </div>
        ))}
      </div>
      <Link to="/generate" className="btn btn-primary">Create New Collection</Link>
    </div>
  );
};

export default ViewCollectionsPage;


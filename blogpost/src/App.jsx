import { useEffect, useState } from 'react';
import './App.css';
function App() {
  const [fetchData, setFetchData] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts.");
        return res.json();
      })
      .then((data) => {
        setFetchData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className='container'>
      <h1>Blog Posts</h1>
      {loading && <p>Loading posts...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {fetchData.map((elem) => (
        <div key={elem.id} className='post'>
          <h3>{elem.title}</h3>
          <p>{elem.body}</p>
          <button onClick={() => setSelectedPost(elem)}>Post Details</button>
        </div>
      ))}
      {selectedPost && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedPost.title}</h2>
            <p>{selectedPost.body}</p>
            <button onClick={() => setSelectedPost(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

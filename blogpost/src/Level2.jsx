import { useEffect, useState } from 'react'
import './App.css'
function App() {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState({})
  const [comments, setComments] = useState({})
  const [expandedPosts, setExpandedPosts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        const postsRes = await fetch("https://jsonplaceholder.typicode.com/posts")
        const postsData = await postsRes.json()
        const userIds = [...new Set(postsData.map(p => p.userId))]
        const userPromises = userIds.map(id =>
          fetch(`https://jsonplaceholder.typicode.com/users/${id}`).then(res => res.json())
        )
        const usersData = await Promise.all(userPromises)
        const usersMap = {}
        usersData.forEach(user => {
          usersMap[user.id] = user
        })
        setPosts(postsData)
        setUsers(usersMap)
      } catch (err) {
        setError("Failed to load posts or users.",err)
      }
    }
    fetchPostsAndUsers()
  }, [])

  const toggleComments = async (postId) => {
    if (expandedPosts.includes(postId)) {
      setExpandedPosts(prev => prev.filter(id => id !== postId))
    } else {
      if (!comments[postId]) {
        try {
          const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
          const data = await res.json()
          setComments(prev => ({ ...prev, [postId]: data }))
        } catch {
          setError(`Failed to load comments for post ${postId}`)
        }
      }
      setExpandedPosts(prev => [...prev, postId])
    }
  }

  return (
    <div className="container">
      <h1>Blog Posts</h1>
      {error && <div className="error">{error}</div>}
      {posts.map(post => {
        const user = users[post.userId]
        const isExpanded = expandedPosts.includes(post.id)
        return (
          <div className="post-card" key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            {user && (
              <p className="author">
                Author: {user.name} (<a href={`mailto:${user.email}`}>{user.email}</a>)
              </p>
            )}
            <button className="toggle-btn" onClick={() => toggleComments(post.id)}>
              {isExpanded ? "Hide Comments" : "Show Comments"}
            </button>

            {isExpanded && (
              <div className="comments-section">
                {comments[post.id] ? (
                  comments[post.id].map(comment => (
                    <div className="comment" key={comment.id}>
                      <strong>{comment.name}</strong> <em>({comment.email})</em>
                      <p>{comment.body}</p>
                    </div>
                  ))
                ) : (
                  <p className="loading">Loading comments...</p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default App

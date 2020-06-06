import React from 'react';
import './App.css';
import axios from 'axios'

class App extends React.Component {
  state = {
    isLoading: true,
    posts: [],
    title: "",
    content: "",
    isEditing: false,
    id: "",
    error: null
  }

  componentDidMount() {
    this._fetchPosts();
  }

  _fetchPosts = () => {
    axios.get(`/api/posts`)
      .then(res => res.data)
      .then(data =>
        this.setState({
          isLoading: false,
          posts: data.posts,
        })
      )
      .catch(error => this.setState({error, isLoading: false }));
  }


  _onChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }

  _onDelete = (id) => {
    const { posts } = this.state;
    axios.delete(`/api/post/${id}`)
    .then(this.setState({ posts: posts.filter(post => post._id !== id) }))
    .catch(err => console.log('err', err))
  }

  _onEdit = (id) => {
    const { isEditing } = this.state;
    this.setState({ isEditing : !isEditing, id})
    axios.get(`/api/post/${id}`)
    .then(res => res.data.post)
    .then(data => (
      this.setState({
        title: data.title,
        content: data.content
      })
    ))
    .catch(error => this.setState({error}))
  }

  _onCancel = () => {
    this.setState({
      isEditing: false,
      title: "",
      content: "",
      id: ""
    })
  }

  _onSubmit = e => {
    e.preventDefault();
    const { title, content, posts, isEditing, id } = this.state;
    const newPost = { title, content }

    if(isEditing){
      return axios.patch(`/api/post/${id}`, newPost)
      .then(res => res.data.post)
      .then(data => {
        const newPosts = posts.map(post => (post._id === data._id) ? { ...data } : post);
        this.setState({
        isEditing: false,
        title: "",
        content: "",
        id: "",
        posts: newPosts
      })})
      .catch(error => this.setState({error}))
    }
    axios.post('/api/posts', newPost)
    .then(res => res.data)
    .then(data => 
      this.setState({
        posts: [...posts, data.post],
        title: "",
        content: ""
      })
    )
    .catch(error => this.setState({error}))
  }

  render() {
    const { isLoading, posts, error, title, content, isEditing } = this.state;
    if (error) {
      return <p>{error.message}</p>}
    if (isLoading) {
      return <p>Loading...</p>}
    return (
      <div className="container">
        <h3 className="text-center">Posts</h3>
        <form onSubmit={this._onSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" required className="form-control" name="title" value={title} onChange={e => this._onChange(e)} />
          </div>
          <div className="form-group">
            <label>Content</label>
            <input type="text" required className="form-control" name="content" value={content} onChange={e => this._onChange(e)} />
          </div>
          <button type="submit" className={`btn btn-${!isEditing ? 'primary' : 'info'}`}>{!isEditing ? 'Submit' : 'Update'}</button>
          {isEditing && <button type="button" className="btn btn-secondary ml-3" onClick={this._onCancel}>Cancel</button>}
        </form>
        {!isEditing && <ul className="list-group mt-3">
          {posts && posts.map(post => 
            <li key={post._id} className="list-group-item">
              <div className="d-flex">
                <div className="flex-grow-1">
                  <p><span className="text-muted">Title:</span> {post.title}</p>
                  <p><span className="text-muted">Content:</span> {post.content}</p>
                </div>
                <div className="align-self-center">
                  <button type="button" className="btn btn-outline-info mr-3" onClick={() => this._onEdit(post._id)}>Edit</button>
                  <button type="button" className="btn btn-outline-danger" onClick={() => this._onDelete(post._id)}>Delete</button>
                </div>
              </div>
            </li>
          )}
        </ul> }
      </div>
    )
  }
    
}

export default App;

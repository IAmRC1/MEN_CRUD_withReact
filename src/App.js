import React from 'react';
import Form from './components/form'
import Post from './components/post'
import Pagination from './components/pagination'
import axios from 'axios'

class App extends React.Component {
  state = {
    isLoading: true,
    posts: [],
    title: "",
    content: "",
    isEditing: false,
    id: "",
    error: null,
    currentPage: 1,
    postsPerPage: 5,
    sortOn:"",
    sortOrder: ""
  }
  
  _paginate = (num) => {
    this.setState({
      currentPage : num
    })
  }
  _prevPage = () => {
    this.setState({
      currentPage : this.state.currentPage-1
    })
  }
  _nextPage = () => {
    this.setState({
      currentPage : this.state.currentPage+1
    })
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

  _onSortOn = (e) => {
    this.setState({ sortOn : e.target.value },
    ()=> {
    axios.get(`/api/posts?sortOn=${this.state.sortOn}&sortOrder=${this.state.sortOrder}`)
    .then(res => res.data)
    .then(data =>
      this.setState({
        isLoading: false,
        posts: data.posts,
      })
    )
    .catch(error => this.setState({error, isLoading: false }));
    });
    
  }

  _onSortOrder = (e) => {
    this.setState({ sortOrder : e.target.value },
    ()=>{
    axios.get(`/api/posts?sortOn=${this.state.sortOn}&sortOrder=${this.state.sortOrder}`)
    .then(res => res.data)
    .then(data =>
      this.setState({
        isLoading: false,
        posts: data.posts,
      })
    )
    .catch(error => this.setState({error, isLoading: false }));
    });
    
  }

  _onPostsPerPageChange = (e) => {
    this.setState({ postsPerPage : e.target.value });
  }

  render() {
    const { isLoading, posts, error, title, content, isEditing, currentPage, postsPerPage, sortOn, sortOrder, } = this.state;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    if (error) {
      return <div className="container"><p className="text-center">{error.message}</p></div>}
    if (isLoading) {
      return <div className="container"><p className="text-center">Loading...</p></div>
    }
    return (
      <div className="container py-5">
        <h3 className="text-center">Posts</h3>
        <Form 
          isEditing={isEditing}
          title={title}
          content={content}
          _onChange={this._onChange}
          _onCancel={this._onCancel}
          _onSubmit={this._onSubmit}
        />
        {!isEditing && 
        <div>
          <div className="row justify-content-between py-3">
            <Pagination
              currentPage={currentPage}
              _paginate={this._paginate}
              _prevPage={this._prevPage}
              _nextPage={this._nextPage}
              totalPosts={posts.length}
              postsPerPage={postsPerPage}
            />
            <div className="d-flex justify-content-center justify-content-sm-end col-xs-12 col-sm-6">
              <select className="custom-select w-25 mr-3" value={this.state.sortOn} onChange={this._onSortOn}>
                <option disabled value="">Sort By</option>
                <option value="title">Title</option>
                <option value="content">Content</option>
                <option value="createdAt">Created At</option>
              </select>
              <select disabled={sortOn === "" ? true : false} className="custom-select w-25 mr-3" value={this.state.sortOrder} onChange={this._onSortOrder}>
                <option disabled value="">Sort Order</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
              <select className="custom-select w-25" value={this.state.postsPerPage} onChange={this._onPostsPerPageChange}>
                <option disabled>Posts Per Page</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>

          </div>
          <ul className="list-group">
          {currentPosts && currentPosts.map(post => 
            <Post
              key={post._id}
              post={post}
              _onEdit={this._onEdit}
              _onDelete={this._onDelete}
            />
          )}
          </ul> 
        </div>
        }
      </div>
    )
  }
    
}

export default App;

import React from 'react'
import moment from 'moment'

class Post extends React.Component {

  parseDate = (date) => {
    return moment(date, 'YYYY-MM-DD').format('ll')
  }

  render() {
    const { post, _onEdit, _onDelete } = this.props;
    return (
      <li className="list-group-item">
        <div className="d-flex">
          <div className="flex-grow-1">
            <p><span className="text-muted">Title:</span> {post.title}</p>
            <p><span className="text-muted">Content:</span> {post.content}</p>
            <p><span className="text-muted">Created at:</span> {this.parseDate(post.createdAt)}</p>
          </div>
          <div className="align-self-center">
            <button type="button" className="btn btn-outline-info mr-3" onClick={() => _onEdit(post._id)}>Edit</button>
            <button type="button" className="btn btn-danger" onClick={() => _onDelete(post._id)}>Delete</button>
          </div>
        </div>
      </li>
      )
  }
}

export default Post
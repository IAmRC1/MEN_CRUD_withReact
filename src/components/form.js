import React from 'react'

class Form extends React.Component {

  render() {
    const { _onChange, _onCancel, _onSubmit, isEditing, title, content } = this.props;
    return (
      <form onSubmit={_onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" required className="form-control" name="title" value={title} onChange={e => _onChange(e)} />
        </div>
        <div className="form-group">
          <label>Content</label>
          <input type="text" required className="form-control" name="content" value={content} onChange={e => _onChange(e)} />
        </div>
        <button type="submit" className={`btn btn-${!isEditing ? 'primary' : 'info'}`}>{!isEditing ? 'Submit' : 'Update'}</button>
        {isEditing && <button type="button" className="btn btn-secondary ml-3" onClick={_onCancel}>Cancel</button>}
      </form>
    )
  }
}

export default Form
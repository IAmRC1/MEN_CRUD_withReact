import React from 'react'

class Pagination extends React.Component {
  render() {
    const { currentPage, _paginate, _prevPage, _nextPage, totalPosts, postsPerPage } = this.props;
    const pageNumbers = [];
    for ( let i = 1 ; i <= Math.ceil( totalPosts / postsPerPage ) ; i++ ) {
      pageNumbers.push(i)
    }
    return (
      <nav className="col-xs-12 col-sm-6 mb-3 mb-sm-0">
        <ul className="pagination justify-content-start mb-0">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}><a className="page-link" href="#!" role="button" onClick={_prevPage}>Previous</a></li>            
          {pageNumbers.map(num => (
            <li key={num} className={`page-item ${num === currentPage ? "active" : ""}`}>
              <a href="#!" className="page-link" role="button" onClick={() => _paginate(num)}>
                {num}
              </a>
            </li>
          ))}
          <li className={`page-item ${currentPage === pageNumbers.length ? "disabled" : ""}`}><a className="page-link" href="#!" role="button" onClick={_nextPage}>Next</a></li>
        </ul>
      </nav>
    )
  }
}

export default Pagination

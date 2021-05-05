import React, { Component } from 'react';
import Loader from './Loader';
import 'bootstrap/dist/css/bootstrap.min.css';
import { observer, inject } from 'mobx-react';
import history from '../history';

@inject('store')
@observer
class RecentSearches extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true
    };
  }
  componentDidMount = () => {
    const { store } = this.props;
    store.changePageIndex('account');
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1000);
  };

  render() {
    const { isLoading } = this.state;

    return (
      <div className="container-md pl-3 pr-3" align="center">
        {isLoading ? (
          <Loader promt="Loading recent searches..." />
        ) : (
          <div>
            <br />
            <br />
            <br />
            <a
              onClick={() => {
                history.push('/');
              }}
            >
              Never
            </a>{' '}
            search yet.
          </div>
        )}
      </div>
    );
  }
}

export default RecentSearches;

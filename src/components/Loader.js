import React from 'react';


export default class Loader extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    const { promt } = this.props;

    return (
      <div className="container-md loader text-center">
        <div className="d-flex justify-content-center">
          <div
            className="spinner-border m-5"
            style={{
              width: '5rem',
              height: '5rem',
              borderWidth: '0.5rem',
              color: '#187ce0'
            }}
            role="status"
          >
            <span className="sr-only">Загрузка...</span>
          </div>
        </div>
        {(
          <h4
            style={{
              color: '#333',
              fontSize: '2rem',
              fontFamily: 'PTSansBold, sans-serif'
            }}
          >
            {promt}
          </h4>
        ) || ''}
      </div>
    );
  }
}

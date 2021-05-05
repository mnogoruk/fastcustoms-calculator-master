import React, { Component } from 'react';
import Loader from './Loader';
import 'bootstrap/dist/css/bootstrap.min.css';
import { observer, inject } from 'mobx-react';
import history from '../history';

const regionalArray = [
  {
    name: 'Хабовые плечи',
    slug: 'routes'
  },
  {
    name: 'Услуги',
    slug: 'services'
  },
  {
    name: 'Вспомогательные плечи',
    slug: 'rates'
  },
  {
    name: 'Районы',
    slug: 'zones'
  }
];

@inject('store')
@observer
class Control extends Component {
  constructor() {
    super();

    this.state = {
      cities: [],
      selected: '',
      isLoading: false
    };
  }
  componentDidMount = () => {
    const { store } = this.props;
    store.changePageIndex('control_panel');
  };

  changeModule = (e, slug) => {
    const { store } = this.props;
    store.changePageIndex(slug);
    history.push('/admin/' + slug);
    e.preventDefault();
  };

  render() {
    const { isLoading } = this.state;

    return (
      <div className="container-md pl-3 pr-3" align="">
        {isLoading ? (
          <Loader promt="Загружаю..." />
        ) : (
          <div>
            <h2
              className="pt-3 pb-3 pl-3"
              onClick={() => this.setState({ selected: '' })}
            >
              Настройки
            </h2>

            <ul className="fl-ul row h-100 pl-3 pr-3">
              {regionalArray.map((region) => (
                <li
                  className="pl-3 col-lg-6 col-sm-6 col-xs-12 cursor"
                  onClick={(e) => this.changeModule(e, region.slug)}
                >
                  <div className="fl-block rounded text-center">
                    <h2 className="mb-1">{region.name}</h2>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default Control;

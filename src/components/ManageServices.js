import React, {  Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { observer, inject } from 'mobx-react';
import history from '../history';

import cyrillicToTranslit from 'cyrillic-to-translit-js';
import { SEARCH_URI_V2 } from '@/constants';
import Loader from "@/components/Loader";

export function declOfNum(number, words) {
  return words[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? number % 10 : 5]
  ];
}

@inject('store')
@observer
class ManageServicesEdit extends Component {
  constructor() {
    super();

    this.state = {
      service: {
        name: '',
        slug: '',
        parent: 1,
        rate: 0,
        ratio: 100,
        services: [],
        transaction: 1
      },
      selected: '',
      isLoading: false,
      id: history.location.pathname.match(/[^/?]*[^/?]/g)[2]
    };
  }
  componentDidMount = () => {
    const { store } = this.props;
    store.changePageIndex('services');
    if (this.state.id !== 'add') this.servicesList();
  };

  handleInput = (e, key, val = '') => {
    const { service } = this.state;
    const value = e.target.value;
    let slugState = {};
    console.log('adf', key);
    if (key == 'name') {
      const slug = cyrillicToTranslit().transform(value, '_').toLowerCase();
      slugState = { ['slug']: slug };
    }
    this.setState({
      service: {
        ...this.state.service,
        ...slugState,
        [key]: value || val
      }
    });
  };

  servicesList = () => {
    this.setState({ isLoading: true });
    fetch(`${SEARCH_URI_V2}/services/${this.state.id}`)
      .then((resp) => resp.json())
      .then((items) => {
        this.setState({
          service: items.service,
          isLoading: false
        });
      });
  };

  changePackage = (e, value) => {
    let tag = value;
    e.target.parentElement
      .querySelectorAll('.active')
      .forEach((e) => e.classList.remove('active'));
    e.target.setAttribute(
      'class',
      'list-group-item list-group-item-action active'
    );
    const { type } = this.state;

    this.setState({ service: { ...this.state.service, parent: tag } });
  };

  changeTransaction = (e, value) => {
    let tag = value;
    e.target.parentElement
      .querySelectorAll('.active')
      .forEach((e) => e.classList.remove('active'));
    e.target.setAttribute(
      'class',
      'list-group-item list-group-item-action active'
    );

    this.setState({ service: { ...this.state.service, transaction: tag } });
  };

  saveForm() {
    const { store } = this.props;
    const { id, service } = this.state;
    this.setState({
      isLoading: true
    });
    fetch(`${SEARCH_URI_V2}/services/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        id: id,
        service: service
      })
    })
      .then((resp) => resp.json())
      .then((items) => {
        this.setState({
          isLoading: false
        });
        history.push(`/admin/services`);
      });
  }

  deleteService = () => {
    const { store } = this.props;
    const { id } = this.state;
    this.setState({
      isLoading: true
    });
    fetch(`${SEARCH_URI_V2}/services/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    })
      .then((resp) => resp.json())
      .then((res) => {
        this.setState({
          isLoading: false
        });
        history.push('/admin/services');
      });
  };

  render() {
    const { isLoading, service, selected, id } = this.state;
    const { store } = this.props;

    return (
      <div className="container-md pl-3 pr-3" align="">
        {isLoading ? (
          <Loader promt="Загружаю..." />
        ) : (
          <div>
            <h2 className="pt-3 pb-3 pl-3">
              {id === 'add'
                ? 'Добавить услугу'
                : `Редактирование "${service.name}"`}
            </h2>

            <div>
              <ul className="list-group list-group-flush">
                {service.parent !== 0 ? (
                  <React.Fragment>
                    {' '}
                    <li className="list-group-item">
                      <label for="name">Название</label>
                      <input
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={service.name}
                        onChange={(e) => this.handleInput(e, 'name')}
                      />
                    </li>
                    <li className="list-group-item">
                      <label for="slug">Вид перевозки</label>

                      <div className="list-group list-group-flush">
                        <button
                          onClick={(e) => this.changePackage(e, 1)}
                          type="button"
                          align="center"
                          className={`list-group-item list-group-item-action ${
                            service.parent === 1 && 'active'
                          }`}
                        >
                          Автомобильная перевозка
                        </button>
                        <button
                          onClick={(e) => this.changePackage(e, 2)}
                          type="button"
                          className={`list-group-item list-group-item-action ${
                            service.parent === 2 && 'active'
                          }`}
                        >
                          Морская перевозка
                        </button>
                        <button
                          onClick={(e) => this.changePackage(e, 3)}
                          type="button"
                          className={`list-group-item list-group-item-action ${
                            service.parent === 3 && 'active'
                          }`}
                        >
                          Авиафрахт
                        </button>
                        <button
                          onClick={(e) => this.changePackage(e, 4)}
                          type="button"
                          className={`list-group-item list-group-item-action ${
                            service.parent === 4 && 'active'
                          }`}
                        >
                          Железнодорожная перевозка
                        </button>
                      </div>
                    </li>{' '}
                  </React.Fragment>
                ) : (
                  ''
                )}
                <li className="list-group-item" style={{ display: 'none' }}>
                  <label for="slug">
                    Цена за кг <span className="pr">S{service.id}KG</span>
                  </label>
                  <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                      <div className="list-group list-group-horizontal">
                        <button
                          onClick={(e) => this.changeTransaction(e, 1)}
                          type="button"
                          align="center"
                          className={`list-group-item list-group-item-action ${
                            service.transaction === 1 && 'active'
                          }`}
                        >
                          ×
                        </button>
                        <button
                          onClick={(e) => this.changeTransaction(e, 2)}
                          type="button"
                          className={`list-group-item list-group-item-action ${
                            service.transaction === 2 && 'active'
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder=""
                      className="ml-3 mr-3 pl-3 pr-3 text-center"
                      value={service.rate}
                      style={{ width: 150, border: '1px solid #ced4da' }}
                      onChange={(e) => this.handleInput(e, 'rate')}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text" id="inputGroup-sizing-lg">
                        €
                      </span>
                    </div>
                  </div>
                </li>
                <li className="list-group-item" style={{ display: 'none' }}>
                  <label for="slug">
                    Цена за м3 <span className="pr">S{service.id}M</span>
                  </label>
                  <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                      <div className="list-group list-group-horizontal">
                        <button
                          onClick={(e) => this.changeTransaction(e, 1)}
                          type="button"
                          align="center"
                          className={`list-group-item list-group-item-action ${
                            service.transaction === 1 && 'active'
                          }`}
                        >
                          ×
                        </button>
                        <button
                          onClick={(e) => this.changeTransaction(e, 2)}
                          type="button"
                          className={`list-group-item list-group-item-action ${
                            service.transaction === 2 && 'active'
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder=""
                      className="ml-3 mr-3 pl-3 pr-3 text-center"
                      value={service.rate}
                      style={{ width: 150, border: '1px solid #ced4da' }}
                      onChange={(e) => this.handleInput(e, 'rate')}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text" id="inputGroup-sizing-lg">
                        €
                      </span>
                    </div>
                  </div>
                </li>
                <li className="list-group-item" style={{ display: '' }}>
                  <label for="slug">Алгоритмы калькулятора</label>
                  <div className="input-group input-group-lg">
                    <div className="input-group-prepend" style={{ width: '100%' }}>
                      <div
                        className="list-group list-group-horizontal pb-5"
                        style={{ width: '100%' }}
                      >
                        <button
                          onClick={(e) => this.changeTransaction(e, 1)}
                          type="button"
                          align="center"
                          className={`list-group-item list-group-item-action ${
                            service.transaction === 1 && 'active'
                          }`}
                        >
                          Умножить на объем груза/общий вес/LDM
                        </button>
                        <button
                          onClick={(e) => this.changeTransaction(e, 2)}
                          type="button"
                          className={`list-group-item list-group-item-action ${
                            service.transaction === 2 && 'active'
                          }`}
                        >
                          Прибавить к стоимости плеча
                        </button>
                      </div>
                    </div>

                    <span style={{ display: 'none' }}>
                      {' '}
                      <input
                        type="text"
                        placeholder=""
                        className="ml-3 mr-3 pl-3 pr-3 text-center"
                        value={service.rate}
                        style={{ width: 150, border: '1px solid #ced4da' }}
                        onChange={(e) => this.handleInput(e, 'rate')}
                      />
                      &nsbp; €
                    </span>
                  </div>
                </li>

                <li className="text-center mt-3 mb-3" style={{ listStyle: 'none' }}>
                  <div className="row mt-5 mb-5">
                    <div
                      className={`col-lg-${
                        id !== 'add' ? 9 : 12
                      } col-md-6 col-sm-6 col-xs-12 text-center`}
                    >
                      <button
                        type="button"
                        className="modal-win btn-style main-btn"
                        style={{ margin: '0 auto' }}
                        onClick={() => this.saveForm()}
                      >
                        {id === 'add' ? 'Добавить услугу' : 'Сохранить услугу'}
                      </button>
                    </div>
                    {id !== 'add' && (
                      <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 text-right pr-5">
                        <button
                          type="button"
                          onClick={() => {
                            const conf = confirm(
                              `Вы действительно хотите удалить услугу?`
                            );
                            if (conf) {
                              this.deleteService();
                            }
                          }}
                          className="btn btn-danger btn-lg mt-4"
                        >
                          Удалить услугу
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </div>

            <div
              className="alert alert-success"
              style={{ display: 'none' }}
              role="alert"
            >
              regions: {JSON.stringify(this.state) || ''}
            </div>
          </div>
        )}
      </div>
    );
  }
}

@inject('store')
@observer
class ManageServices extends Component {
  constructor() {
    super();

    this.state = {
      services: [],
      selected: '',
      isLoading: false
    };
  }
  componentDidMount = () => {
    const { store } = this.props;
    store.changePageIndex('services');
    this.servicesList();
  };

  servicesList = () => {
    this.setState({ isLoading: true });
    fetch(`${SEARCH_URI_V2}/services`)
      .then((resp) => resp.json())
      .then((items) => {
        this.setState({
          services: items.services,
          isLoading: false
        });
      });
  };

  handleRegional = (slug) => {
    this.setState({
      selected: slug,
      isLoading: true
    });
    this.RegionsList(slug);
  };

  render() {
    const { isLoading, services, selected } = this.state;
    const { store } = this.props;

    return (
      <div className="container-md pl-3 pr-3" align="">
        {isLoading ? (
          <Loader promt="Загружаю..." />
        ) : (
          <div>
            <div className="row pt-3 pb-3">
              <div className="col-md-6 pl-3 ">
                <h2 className="mb-3">Услуги</h2>
              </div>
              <div className="col-md-6 pr-3 text-right">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => history.push('/admin/services/add')}
                >
                  Добавить услугу
                </button>
              </div>
            </div>

            {!selected && (
              <ul className="list-group list-group-flush">
                {services
                  .filter((x) => x.parent === 0)
                  .map((service) => (
                    <li className="list-group-item">
                      <div className="d-flex w-100">
                        <h5 className="mb-1">
                          {service.name}
                          {service.total_services
                            ? `, ${
                                service.total_services
                              } ${declOfNum(service.total_services, [
                                'услуга',
                                'услуги',
                                'услуг'
                              ])} `
                            : ``}
                        </h5>
                      </div>

                      <p>
                        <span style={{ display: 'none' }}>
                          Цена за 1 единицу груза × €{service.rate || 0} ×{' '}
                          {service.ratio || 100}%
                          <br />
                        </span>

                        {!service.total_services &&
                          `${service.name} не имеет услуг`}
                        <ul className="list-group list-group-flush">
                          {services
                            .filter((x) => x.parent === service.id)
                            .map((region, i) => (
                              <li
                                className="list-group-item list-group-item-action"
                                onClick={() =>
                                  history.push(`/admin/services/${region.id}`)
                                }
                              >
                                <span>
                                  {region.name}
                                  <span style={{ display: 'none' }}>
                                    {i <
                                      services.filter(
                                        (x) => x.parent === service.id
                                      ).length -
                                        1 && ','}{' '}
                                    {region.transaction === 1 ? '×' : '+'}€
                                    {region.rate || 0}
                                  </span>
                                </span>
                              </li>
                            ))}
                        </ul>
                      </p>
                    </li>
                  ))}
              </ul>
            )}

            {selected && (
              <div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <label for="name">Название услуги</label>
                    <input
                      type="text"
                      placeholder="Подача авто на склад"
                      className="form-control"
                      id="name"
                      onChange={(e) => this.handleInput(e, 'name')}
                    />
                  </li>
                  <li className="list-group-item">
                    <label for="slug">Услуга на английском</label>
                    <input
                      type="text"
                      placeholder="car_delivery_warehouse"
                      className="form-control"
                      id="slug"
                      onChange={(e) => this.handleInput(e, 'slug')}
                    />
                  </li>
                  <li className="list-group-item">
                    <button type="button" className="btn btn-success btn-lg">
                      Добавить
                    </button>
                  </li>
                </ul>
              </div>
            )}

          </div>
        )}
      </div>
    );
  }
}

export { ManageServices, ManageServicesEdit };

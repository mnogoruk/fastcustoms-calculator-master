import React, {Component} from 'react';
import Loader from './Loader';
import 'bootstrap/dist/css/bootstrap.min.css';
import {inject, observer} from 'mobx-react';
import MagicCountry from '../elements/Country';
import MagicCity from '../elements/City';
import history from '../history';
import {SEARCH_URI_V2} from '@/constants';
import {PricesBlock} from "./PricesBlock";
import regeneratorRuntime from "regenerator-runtime";

@inject('store')
@observer
class ManageRoutesAdd extends Component {
  constructor() {
    super({});

    this.state = {
      services: [],
      selectedRegions: [],
      selServices: [],
      selectedServices: [],
      zones: [],
      routeType: 'EURO',
      routes: [0, 1],
      isLoading: true,
      currencyLoading: true,
      currencyDate: '',
      rates: {
        USD: 0,
        RUB: 0,
        CNY: 0
      },
      id: history.location.pathname.match(/[^/?]*[^/?]/g)[2],
      route: []
    };
  }
  componentDidMount = async () => {
    const { store } = this.props;
    const { id } = this.state;

    store.changePageIndex('options');
    await this.routeDetails(id);
    await this.zonesList();
    await this.servicesList();
  };

  typeCarrier = (parent) => {
    switch (parent) {
      case 1:
        return 'Автомобильная перевозка';
      case 2:
        return 'Морская перевозка';
      case 3:
        return 'Авиафрахт';
      case 4:
        return 'Железнодорожная перевозка';
    }
  };

  routeDetails = (id) => {
    if (!parseInt(id)) return false;
    this.setState({ isLoading: true });
    fetch(`${SEARCH_URI_V2}/routes/${id}`)
      .then((resp) => resp.json())
      .then((row) => {
        this.setState({
          route: row.route,
          isLoading: false,
          selectedServices: row.services.map((x) => x.id),
          selServices: row.services
        });

        const sanitizePrices = (data, context) => {
          let prices = data.filter((x) => x.context === context);
          prices.map((x) => {
            x['price'] = x['value'];
            x['id'] = x['rangeTo'];
            delete x['rangeFrom'];
            delete x['rangeTo'];
            delete x['context'];
            return x;
          });
          return prices;
        };
        this.props.store.ranges.kg = sanitizePrices(row.prices, 'kg');
        this.props.store.ranges.m = sanitizePrices(row.prices, 'm');
        this.props.store.ranges.ldm = sanitizePrices(row.prices, 'ldm');
      });
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

  zonesList = (slug) => {
    this.setState({ isLoading: true });
    fetch(`${SEARCH_URI_V2}/zones`)
      .then((resp) => resp.json())
      .then((items) => {
        this.setState({
          zones: items.zones,
          isLoading: false
        });
      });
  };

  createRoute = () => {
    const { store } = this.props;
    const {
      selectedRegions,
      id,
      route,
      selServices
    } = this.state;
    this.setState({
      isLoading: true
    });
    let body = {
      id: id,
      from: {
        country_id: route.fromCountryId || store.calculate.fromCountry.id,
        country_name: route.fromCountry || store.calculate.fromCountry.name,
        city_id: route.fromCityId || store.calculate.fromCity.id,
        city_name: route.fromCity || store.calculate.fromCity.name
      },
      to: {
        country_id: route.toCountryId || store.calculate.toCountry.id,
        country_name: route.toCountry || store.calculate.toCountry.name,
        city_id: route.toCityId || store.calculate.toCity.id,
        city_name: route.toCity || store.calculate.toCity.name
      },
      regions: selectedRegions[0],
      selServices: selServices,
      prices: store.ranges
    }
    console.log({body})
    fetch(`${SEARCH_URI_V2}/routes`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',

      body: JSON.stringify(body)
    })
      .then((resp) => resp.json())
      .then((items) => {
        this.setState({
          isLoading: false
        });
        history.push('/admin/routes');
      });
  };

  deleteRoute = () => {
    const { store } = this.props;
    const { id } = this.state;
    this.setState({
      isLoading: true
    });
    fetch(`${SEARCH_URI_V2}/routes/${id}`, {
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
        history.push('/admin/routes');
      });
  };

  changeRouteType = (e, val) => {
    e.target.parentElement
      .querySelectorAll('.active')
      .forEach((e) => e.classList.remove('active'));
    e.target.setAttribute(
      'class',
      'list-group-item list-group-item-action active'
    );
    this.setState({ routeType: val });
  };

  checkService(e, service_id, type) {
    let tag = e.currentTarget.dataset.package;
    e.target.parentElement
      .querySelectorAll('.active')
      .forEach((e) => e.classList.remove('active'));
    e.target.setAttribute(
      'class',
      'list-group-item list-group-item-action active'
    );
    const { selectedServices, selectedRegions } = this.state;
    if (selectedServices.includes(service_id)) {
      selectedServices.splice(
        selectedServices.findIndex((item) => item === service_id),
        1
      );

      this.setState({ selectedServices: selectedServices });
    } else {
      console.log(selectedServices);

      this.setState({ selectedServices: [service_id] });
      //  this.setState({ selectedServices: selectedServices.concat(service_id)    })
    }
  }

  changeTransaction = (
    e,
    value,
    id,
  ) => {
    const { selServices } = this.state;

    e.target.parentElement
      .querySelectorAll('.active')
      .forEach((e) => e.classList.remove('active'));
    e.target.setAttribute(
      'class',
      'list-group-item list-group-item-action active'
    );

    if (value) {
      let services = selServices.filter((x) => x.id !== id);
      services.push({ id: id, prices: [] });
      this.setState({ selServices: services });
    } else {
      let services = selServices.filter((x) => x.id !== id);
      this.setState({ selServices: services });
    }
  };

  changeSelService = (e, service_id) => {
    const { selServices } = this.state;

    let exist = selServices.filter((x) => service_id === x.id).length;

    if (exist) {
      let services = selServices.filter((x) => x.id !== service_id);
      this.setState({ selServices: services });
    } else {
      let services2 = []; // selServices
      services2.push({ id: service_id, prices: [] });
      this.setState({ selServices: services2 });
    }

    this.checkService(e, service_id);
  };

  checkRegion(e, region_id, type) {
    e.target.parentElement
      .querySelectorAll('.active')
      .forEach((e) => e.classList.remove('active'));
    e.target.setAttribute(
      'class',
      'list-group-item list-group-item-action active'
    );
    const { selectedRegions } = this.state;
    if (selectedRegions.includes(region_id)) {
      selectedRegions.splice(
        selectedRegions.findIndex((item) => item === region_id),
        1
      );

      this.setState({ selectedRegions: selectedRegions });
    } else {
      this.setState({ selectedRegions: [region_id] });
    }
  }

  handleInput = (e, block) => {
    const { selServices } = this.state;
    const id = parseInt(e.target.name.replace(`service_${block}_`, ''));
    const value = e.target.value || '';

    let services = selServices;
    const index = services.findIndex((x) => x.id === id);
    services[index].prices = {
      ...services[index].prices,
      [block]: value
    };
    console.log(index, id);
    this.setState({
      selServices: services
    });
  };

  render() {
    const {
      id,
      rates,
      isLoading,
      zones,
      services,
      selectedServices,
      selectedRegions,
      route,
      selServices
    } = this.state;
    const { store } = this.props;
    const additionalServices = services.filter((x) =>
      selectedServices.includes(x.parent)
    );
    console.log("FEGRHETRJTDGSFWT#$#Y%UHETRGW%#U^RJ")
    return (
      <div className="container-md pl-3 pr-3" align="">
        {isLoading ? (
          <Loader promt="Загружаю плечо..." />
        ) : (
          <div>
            <div className="row pt-3 pb-3">
              <div className="col-md-6 pl-3">
                <h2>
                  {id === 'add' ? (
                    `Добавить плечо`
                  ) : (
                    <span>
                      Редактирование плеча
                      <br />
                      &laquo;{route.fromCityId} → {route.toCityId}&raquo;
                    </span>
                  )}
                </h2>
              </div>
              <div className="col-md-6 pl-3 text-right pt-3 pr-3">
                <h2>
                  <a
                    href="/"
                    className="btn btn-lg btn-primary"
                    onClick={(e) => {
                      history.push('/admin/routes');
                      e.preventDefault();
                    }}
                  >
                    Все плечи
                  </a>
                </h2>
              </div>
            </div>

            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="row carriage nom">
                  {route.fromCountryId ? (
                    <React.Fragment>
                      <div className="bl-1 col-lg-6 col-md-6 col-sm-12 col-xs-12 mt-2 pr-3">
                        <label>Отправление</label>

                        <h2>{route.fromCityId}</h2>
                        <h4>{route.fromCountryId}</h4>
                      </div>
                      <div className="bl-1 col-lg-6 col-md-6 col-sm-12 col-xs-12 mt-2 pl-3">
                        <label>Прибытие</label>
                        <h2>{route.toCityId}</h2>
                        <h4>{route.toCountryId}</h4>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div className="bl-1 col-lg-6 col-md-6 col-sm-12 col-xs-12 mt-2 pr-3">
                        <label>Отправление</label>

                        <MagicCountry id="fromCountry" placeholder={'Страна'} />
                        <br />
                        {store.calculate.fromCountry.id && (
                          <MagicCity id="fromCity" placeholder={'Город'} />
                        )}
                      </div>
                      <div className="bl-1 col-lg-6 col-md-6 col-sm-12 col-xs-12 mt-2 pl-3">
                        <label>Прибытие</label>
                        <MagicCountry id="toCountry" placeholder={'Страна'} />
                        <br />
                        {store.calculate.toCountry.id && (
                          <MagicCity id="toCity" placeholder={'Город'} />
                        )}
                      </div>
                    </React.Fragment>
                  )}
                  <div
                    className="bl-1 col-lg-12 col-md-212 col-sm-12 col-xs-12 mt-2"
                    style={{ display: 'none' }}
                  >
                    <label>Географический регион</label>

                    <div className="list-group list-group-flush">
                      {zones.map((zone) => (
                        <button
                          key={zone.id}
                          onClick={(e) => this.checkRegion(e, zone.id)}
                          type="button"
                          align="center"
                          className={`list-group-item list-group-item-action ${
                            selectedRegions.includes(zone.id) ? 'active' : ''
                          }`}
                          style={
                            selectedRegions.includes(zone.id)
                              ? { backgroundColor: '#007bff', color: '#fff' }
                              : { backgroundColor: '' }
                          }
                        >
                          {zone.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bl-1 col-lg-12 col-md-212 col-sm-12 col-xs-12 pt-3">
                    <label>Вид перевозки</label>

                    <div
                      className="list-group"
                      style={{ maxWidth: '70%', margin: '0 auto' }}
                    >
                      {services
                        .filter((x) => x.parent === 0)
                        .map((service) => (
                          <button
                            key={service.id}
                            onClick={(e) => {
                              this.changeSelService(e, service.id);
                            }}
                            type="button"
                            align="center"
                            className={`list-group-item list-group-item-action ${
                              selectedServices.includes(service.id)
                                ? 'active'
                                : ''
                            }`}
                            style={
                              selectedServices.includes(service.id)
                                ? { backgroundColor: '#007bff', color: '#fff' }
                                : { backgroundColor: '' }
                            }
                          >
                            {service.name}
                          </button>
                        ))}
                    </div>
                  </div>

                  <div className="bl-1 col-lg-12 col-md-212 col-sm-12 col-xs-12 pt-3">
                    <label>Цены</label>

                    <div className="row pl-3 pt-3">
                      <div className="col-3">
                        <div
                          className="nav flex-column nav-pills"
                          id="v-pills-tab"
                          role="tablist"
                          aria-orientation="vertical"
                        >
                          <a
                            className="nav-link active"
                            id="v-pills-home-tab"
                            data-toggle="pill"
                            href="#v-prices-kg"
                            role="tab"
                            aria-controls="v-pills-home"
                            aria-selected="true"
                          >
                            Цены по весу
                          </a>
                          <a
                            className="nav-link"
                            id="v-pills-profile-tab"
                            data-toggle="pill"
                            href="#v-prices-m"
                            role="tab"
                            aria-controls="v-pills-profile"
                            aria-selected="false"
                          >
                            Цены за объём груза
                          </a>
                          <a
                            className="nav-link"
                            id="v-pills-messages-tab"
                            data-toggle="pill"
                            href="#v-prices-ldm"
                            role="tab"
                            aria-controls="v-pills-messages"
                            aria-selected="false"
                          >
                            Цены за погрузочный метр
                          </a>
                        </div>
                      </div>
                      <div className="col-9 pl-5">
                        <div className="tab-content" id="v-pills-tabContent">
                          <div
                            className="tab-pane fade show active"
                            id="v-prices-kg"
                            role="tabpanel"
                            aria-labelledby="v-pills-home-tab"
                          >
                            <PricesBlock block={'kg'} parent={this.state} />
                          </div>
                          <div
                            className="tab-pane fade"
                            id="v-prices-m"
                            role="tabpanel"
                            aria-labelledby="v-pills-profile-tab"
                          >
                            <PricesBlock block={'m'} parent={this.state} />
                          </div>
                          <div
                            className="tab-pane fade"
                            id="v-prices-ldm"
                            role="tabpanel"
                            aria-labelledby="v-pills-messages-tab"
                          >
                            <PricesBlock block={'ldm'} parent={this.state} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bl-1 col-lg-12 col-md-212 col-sm-12 col-xs-12 mt-2">
                    <label>Услуги</label>

                    {!additionalServices.length ? (
                      <div className="pl-3 pr-3 pb-5 pt-5 text-center">
                        <h3>Нет доступных услуг</h3>
                        <p>Услуги зависят, &laquo;Вид перевозки&raquo;.</p>
                      </div>
                    ) : (
                      additionalServices.map((service) => (
                        <div className="list-group list-group-flush">
                          <li className="list-group-item">
                            <div className="row">
                              <div className="col-lg-4 col-md-12">
                                <h4>{service.name}</h4>
                                <h5>{this.typeCarrier(service.parent)}</h5>
                              </div>
                              <div className="col-lg-8 col-md-12">
                                <div className="input-group input-group-lg inp_w">
                                  <div className="input-group-prepend">
                                    <div className="list-group list-group-horizontal">
                                      <button
                                        onClick={(e) =>
                                          this.changeTransaction(
                                            e,
                                            0,
                                            service.id
                                          )
                                        }
                                        type="button"
                                        align="center"
                                        className={`list-group-item list-group-item-action ${
                                          !selServices
                                            .filter((x) => x.id === service.id)
                                            .map((x) => x.id).length && 'active'
                                        }`}
                                      >
                                        Нет
                                      </button>
                                      <button
                                        onClick={(e) =>
                                          this.changeTransaction(
                                            e,
                                            1,
                                            service.id
                                          )
                                        }
                                        type="button"
                                        className={`list-group-item list-group-item-action ${
                                          selServices
                                            .filter((x) => x.id === service.id)
                                            .map((x) => x.id).length && 'active'
                                        }`}
                                      >
                                        Да
                                      </button>
                                    </div>
                                  </div>
                                  <span className="pt-3 pl-3">
                                    {service.transaction === 1 ? '×' : '+'}
                                  </span>
                                  {service.transaction === 1 ? (
                                    <React.Fragment>
                                      <div className="inp inp-start">
                                        {' '}
                                        <label>КГ</label>
                                        <input
                                          type="text"
                                          className="fc fc-1"
                                          name={`service_kg_${service.id}`}
                                          onChange={(e) =>
                                            this.handleInput(e, `kg`)
                                          }
                                          value={selServices
                                            .filter((x) => x.id === service.id)
                                            .map((x) => x.prices.kg)}
                                          disabled={
                                            !selServices
                                              .filter(
                                                (x) => x.id === service.id
                                              )
                                              .map((x) => x.id).length
                                          }
                                          style={{
                                            cursor:
                                              !selServices
                                                .filter(
                                                  (x) => x.id === service.id
                                                )
                                                .map((x) => x.id).length &&
                                              'no-drop'
                                          }}
                                        />
                                      </div>
                                      <div className="inp">
                                        {' '}
                                        <label>
                                          M<sup>3</sup>
                                        </label>
                                        <input
                                          type="text"
                                          className="fc fc-2"
                                          name={`service_m_${service.id}`}
                                          onChange={(e) =>
                                            this.handleInput(e, `m`)
                                          }
                                          value={selServices
                                            .filter((x) => x.id === service.id)
                                            .map((x) => x.prices.m)}
                                          disabled={
                                            !selServices
                                              .filter(
                                                (x) => x.id === service.id
                                              )
                                              .map((x) => x.id).length
                                          }
                                          style={{
                                            cursor:
                                              !selServices
                                                .filter(
                                                  (x) => x.id === service.id
                                                )
                                                .map((x) => x.id).length &&
                                              'no-drop'
                                          }}
                                        />
                                      </div>
                                      <div className="inp">
                                        {' '}
                                        <label>LDM</label>
                                        <input
                                          type="text"
                                          className="fc fc-3"
                                          name={`service_ldm_${service.id}`}
                                          onChange={(e) =>
                                            this.handleInput(e, `ldm`)
                                          }
                                          value={selServices
                                            .filter((x) => x.id === service.id)
                                            .map((x) => x.prices.ldm)}
                                          disabled={
                                            !selServices
                                              .filter(
                                                (x) => x.id === service.id
                                              )
                                              .map((x) => x.id).length
                                          }
                                          style={{
                                            cursor:
                                              !selServices
                                                .filter(
                                                  (x) => x.id === service.id
                                                )
                                                .map((x) => x.id).length &&
                                              'no-drop'
                                          }}
                                        />
                                      </div>
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment>
                                      <div className="inp inp-start">
                                        <div className="inp">
                                          {' '}
                                          <label/>
                                          <input
                                            type="text"
                                            className="fc fc-0"
                                            name={`service_s_${service.id}`}
                                            onChange={(e) =>
                                              this.handleInput(e, `s`)
                                            }
                                            value={selServices
                                              .filter(
                                                (x) => x.id === service.id
                                              )
                                              .map((x) => x.prices.s)}
                                            disabled={
                                              !selServices
                                                .filter(
                                                  (x) => x.id === service.id
                                                )
                                                .map((x) => x.id).length
                                            }
                                            style={{
                                              cursor:
                                                !selServices
                                                  .filter(
                                                    (x) => x.id === service.id
                                                  )
                                                  .map((x) => x.id).length &&
                                                'no-drop'
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  )}
                                  &nbsp;
                                  <span className="pt-3">€</span>
                                </div>
                              </div>
                            </div>
                          </li>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </li>
              <li style={{ listStyle: 'none' }}>
                <div className="row mt-5 mb-5">
                  <div
                    className={`col-lg-${
                      id !== 'add' ? 9 : 12
                    } col-md-6 col-sm-6 col-xs-12 text-center`}
                  >
                    <button
                      type="button"
                      style={{ margin: '0 auto' }}
                      onClick={() => this.createRoute()}
                      className="modal-win btn-style main-btn"
                    >
                      {id === 'add' ? `Добавить плечо` : `Сохранить плечо`}
                    </button>
                  </div>
                  {id !== 'add' && (
                    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          const conf = confirm(
                            `Вы действительно хотите удалить плечо?`
                          );
                          if (conf) {
                            this.deleteRoute();
                          }
                        }}
                        className="btn btn-danger btn-lg mt-4"
                      >
                        Удалить плечо
                      </button>
                    </div>
                  )}
                </div>
              </li>
            </ul>

          </div>
        )}
      </div>
    );
  }
}

export default ManageRoutesAdd;

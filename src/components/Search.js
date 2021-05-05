import React, {  Component } from 'react';
import OfferForm from './OfferForm';
import Loader from './Loader';
import 'bootstrap/dist/css/bootstrap.min.css';
import Stepper from 'react-stepper-horizontal';
import { observer, inject } from 'mobx-react';
import CarIcon from '../icons/car.svg';
import RailsIcon from '../icons/rail.svg';
import SeaIcon from '../icons/sea.svg';
import AviaIcon from '../icons/avia.svg';
import TimeIcon from '../icons/time.svg';
import history from '../history';
import MapBox from './DrawMapbox';
import DrawLine from './DrawLine';
import { SEARCH_URI_V2 } from '@/constants';

export function declOfNum(number, words) {
  return words[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? number % 10 : 5]
  ];
}

export function methodDest(type) {
  switch (type) {
    case 'car':
      return (
        <img fill="red" stroke="green" className="svg icon" src={CarIcon} />
      );
    case 'sea':
      return <img className="svg icon" src={SeaIcon} />;
    case 'avia':
      return <img className="svg icon" src={AviaIcon} />;
    case 'time':
      return <img className="svg icon" src={TimeIcon} />;
    case 'rails':
      return <img className="svg icon" src={RailsIcon} />;
    default:
      return <img className="svg icon" src={CarIcon} />;
  }
}

export function currencySymbol(value, type) {
  switch (type) {
    case 'EUR':
      return <span>€{value}</span>;
    case 'USD':
      return <span>${value}</span>;
    case 'RUB':
      return <span>{value} ₽</span>;
    case 'CNY':
      return <span>¥{value}</span>;
  }
}

@inject('store')
@observer
export default class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      routes: [],
      search_id: 0,
      isLoading: true
    };
  }

  componentDidMount = () => {
    const { calculateReceive, total } = this.props.store;
    if (calculateReceive.calculate.fromCountry.id)
      this.SearchRoutes(calculateReceive);
    if (!calculateReceive.calculate.fromCountry.id || !total.weight)
      history.push('/');
  };

  SearchRoutes = (params) => {
    this.setState({ isLoading: true });
    fetch(`${SEARCH_URI_V2}/routes7`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        from: {
          country: params.calculate.fromCountry,
          city: params.calculate.fromCity
        },
        to: {
          country: params.calculate.toCountry,
          city: params.calculate.toCity
        },
        carriages: params.options.carriages,
        metric: {
          length: params.options.metric,
          weight: params.options.weight_metric
        },
        type: params.options.package,
        total: this.props.store.total
      })
    })
      .then((resp) => resp.json())
      .then((items) => {
        this.setState({
          routes: items.routes,
          search_id: items.search_id,
          isLoading: false
        });
      });
  };

  render() {
    const { store } = this.props;
    const { routes, search_id, isLoading } = this.state;

    const Results = () => {
      return (
        <div className="container" align="">
          {isLoading ? (
            <Loader promt="Рассчитываю варианты перевозок..." />
          ) : (
            <div className="row mt-5 pl-5">
              <ul className="fl-ul row h-100 pl-3 pr-3 w-100">
                {this.state.routes.map((route, i) => {
                  return (
                    <React.Fragment>
                      <li className="col-12">
                        <div
                          className="row fl-block rounded"
                          style={{ padding: 0, marginLeft: 0, marginRight: 0 }}
                        >
                          <div
                            className="col-lg-5 col-md-6 col-xs-12 pl-5 pr-3 cursor"
                            style={{ padding: 20, paddingTop: '30px' }}
                            onClick={() => {
                              this.props.store.modalToggle({
                                id: 'details_route',
                                name: 'Подробный маршрут',
                                data: route,
                                round: false
                              });
                            }}
                          >
                            <DrawLine dests={route.dests} />
                          </div>
                          <div className="col-lg-7 col-md-6 col-xs-12">
                            <MapBox route={route.dests} zoom={3} key={i} />
                          </div>
                          <div className="col-lg-5 col-md-6 col-xs-12 pl-5 pr-3"></div>
                          <div
                            className="col-lg-7 col-md-6 col-xs-12"
                            style={{
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              width: '100%',
                              position: 'absolute',
                              bottom: 20,
                              zIndex: 999999,
                              right: 0
                            }}
                          >
                            <div className="btn--map--order">
                              <button
                                type="button"
                                className="modal-win btn-style main-btn overlay"
                                data-toggle="modal"
                                data-target="#staticBackdrop"
                                onClick={() => {
                                  this.props.store.generateRoute({
                                    initial: route,
                                    searchId: search_id
                                  });
                                  history.push('/create');
                                }}
                              >
                                Оформить заказ{' '}
                                {currencySymbol(
                                  route.price[
                                    this.props.store.currency.toLowerCase()
                                  ],
                                  this.props.store.currency
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    </React.Fragment>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      );
    };

    return (
      <div>
        <div className="container-fluid">
          {isLoading ? (
            <div>
              <Stepper
                steps={[
                  { title: 'Рассчёт стоимости' },
                  { title: 'Выбор доставки' },
                  { title: 'Оформление заказа' }
                ]}
                activeColor={'#187ce0'}
                defaultTitleColor={'#333'}
                size={50}
                circleTop={0}
                defaultColor={'#b5c7d8'}
                defaultTitleColor={'#b5c7d8'}
                defaultBarColor={'#b5c7d8'}
                defaultBorderWidth={'30px'}
                circleFontSize={20}
                lineMarginOffset={18}
                titleFontSize={'PTSansBold, sans-serif'}
                completeTitleColor={'#187ce0'}
                completeColor={'#187ce0'}
                activeStep={1}
              />
              <Loader promt={'Рассчитываю варианты...'} />
            </div>
          ) : (
            <div>
              {this.state.routes.length ? (
                <div>
                  <Stepper
                    steps={[
                      { title: 'Рассчёт стоимости' },
                      { title: 'Выбор доставки' },
                      { title: 'Оформление заказа' }
                    ]}
                    activeColor={'#187ce0'}
                    defaultTitleColor={'#333'}
                    size={50}
                    circleTop={0}
                    defaultColor={'#b5c7d8'}
                    defaultTitleColor={'#b5c7d8'}
                    defaultBarColor={'#b5c7d8'}
                    defaultBorderWidth={'30px'}
                    circleFontSize={20}
                    lineMarginOffset={18}
                    titleFontSize={'PTSansBold, sans-serif'}
                    completeTitleColor={'#187ce0'}
                    completeColor={'#187ce0'}
                    activeStep={1}
                  />
                  <Results />
                </div>
              ) : (
                <div>
                  <Stepper
                    steps={[
                      { title: 'Рассчёт стоимости' },
                      { title: 'Выбор доставки' }
                    ]}
                    activeColor={'#187ce0'}
                    defaultTitleColor={'#333'}
                    size={50}
                    circleTop={0}
                    defaultColor={'#b5c7d8'}
                    defaultTitleColor={'#b5c7d8'}
                    defaultBarColor={'#b5c7d8'}
                    defaultBorderWidth={'30px'}
                    circleFontSize={20}
                    lineMarginOffset={18}
                    titleFontSize={'PTSansBold, sans-serif'}
                    completeTitleColor={'#187ce0'}
                    completeColor={'#187ce0'}
                    activeStep={1}
                  />

                  <div
                    className="jumbotron ml-3"
                    align="center"
                    style={{
                      padding: '1rem 2rem',
                      backgroundColor: '#f8f9fa',
                      margin: '2rem 0'
                    }}
                  >
                    <h1 className="display-4">Нечего предлодить</h1>
                    <p className="lead">
                      По вашему направлению мы не осуществляем перевозку.
                    </p>
                    <hr className="my-4" />
                    <a
                      className="btn btn-primary btn-lg"
                      href="/"
                      onClick={(e) => {
                        history.push('/');
                        e.preventDefault();
                        return false;
                      }}
                      role="button"
                    >
                      Вернуться на главную
                    </a>
                  </div>
                </div>
              )}
              <OfferForm />
            </div>
          )}
        </div>
        <span style={{ opacity: 0, zIndex: -1 }}>
          {this.props.store.currency}
        </span>
      </div>
    );
  }
}

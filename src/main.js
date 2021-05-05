import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { Route, Router, withRouter } from 'react-router-dom';
import './css/main.css';
import './css/sidebar.css';
import Calculate from './components/Calculate';
import storeInstance from './store/Store';
import { useObserver, observer, inject, Provider } from 'mobx-react';
import Orders from './components/Orders';
import SearchResults from './components/Search';
import CreateOrder from './components/CreateOrder';
import RecentSearches from './components/ManageRecently';
import ManageRoutesList from './components/ManageRoutesList';
import ManageRoutesAdd from './components/ManageRoutesAdd';
import Rates from './components/ManageRates';
import {
  ManageServices,
  ManageServicesEdit
} from './components/ManageServices';
import Control from './components/ManageControl';
import { Zones, ZonesEdit } from './components/ManageZones';
import history from './history';
import Footer from './components/Footer';
import './css/format_main.css';
import './css/format.css';
import Logo from './images/logo.png';
import mainBg from './images/main_bg.jpg';

export const EXCHANGE_RATES_SERVLET =
  'https://www.cbr-xml-daily.ru/daily_json.js';

const NavBarLinks = [
  {
    link: '/',
    component: 'calculate',
    name: 'Рассчёт доставки'
  },
  {
    link: '/account/orders',
    component: 'orders',
    name: 'Заказы'
  },
  {
    link: '/admin',
    component: 'admin',
    name: 'Настройки'
  }
];

export const StoreContext = React.createContext(0);

@inject('store')
@observer
class Main extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currencyLoading: true,
      currencyDate: '',
      rates: {
        USD: 0,
        RUB: 0,
        CNY: 0
      }
    };
  }
  componentDidMount = () => {};

  Currencies = (query) => {
    this.setState({ currencyLoading: true });
    fetch(EXCHANGE_RATES_SERVLET)
      .then((resp) => resp.json())
      .then((items) => {
        this.setState({
          rates: items.Valute,
          currencyDate: new Date(items.Date).toLocaleString(),
          currencyLoading: false
        });
      });
  };

  changeModule = (e, link, slug) => {
    const { store } = this.props;
    store.changePageIndex(slug);
    history.push(link);
    e.preventDefault();
  };

  render() {
    const { store } = this.props;

    return (
      <Router history={history}>
        <header
          className="header"
          style={{ backgroundImage: `url(${mainBg})` }}
        >
          <div className="container">
            <div className="header__top">
              <a
                href="/"
                onClick={(e) => {
                  history.push('/');
                  e.preventDefault();
                }}
              >
                <div className="header__top__logo">
                  <img src={Logo} alt="logo" className="logo" />
                  <div className="logo-descr">
                    <p className="name">
                      <span>Format</span>Logistic
                    </p>
                    <p>Перевозки грузов в Россию</p>
                  </div>
                </div>
              </a>
              <div className="header__top__backcall">
                <a href="tel:+74992816081" className="phone-link">
                  +7 (499) 281-60-81
                </a>
                <a
                  href="/"
                  onClick={(e) => {
                    history.push('/account/orders');
                    e.preventDefault();
                  }}
                  className="modal-win header-btn"
                >
                  Личный кабинет
                </a>
                {!1 && (
                  <a
                    href="/"
                    onClick={(e) => {
                      history.push('/admin');
                      e.preventDefault();
                    }}
                    className="modal-win header-btn"
                  >
                    Администрирование
                  </a>
                )}
              </div>
            </div>
            <div className="header__content">
              <div className="header__content__left-side">
                <div
                  style={{
                    position: 'fixed',
                    display: 'none',
                    bottom: 20,
                    width: '15rem',
                    cursor: 'pointer'
                  }}
                  align="center"
                  onClick={(event) =>
                    window.open(
                      'https://www.ligovsky.com/?ref=freight&version=beta-103'
                    )
                  }
                >
                  Версия 1.0 Бета 3
                </div>

                <Route exact path="/" render={() => <Calculate />} />
                <Route exact path="/search" render={() => <Calculate />} />
                <Route exact path="/create" render={() => <CreateOrder />} />
                <Route path="/account/orders" render={() => <Orders />} />
                <Route
                  exact
                  path="/search/results"
                  render={() => <SearchResults />}
                />
                <Route
                    exact
                    path="/admin/routes/add/"
                    render={() => <ManageRoutesAdd />}
                />
                <Route
                  exact
                  path="/admin/routes"
                  render={() => <ManageRoutesList />}
                />

                <Route
                  exact
                  path="/admin/routes/:id"
                  render={() => <ManageRoutesAdd />}
                />
                <Route
                  path="/admin/recently"
                  render={() => <RecentSearches />}
                />
                <Route path="/admin/rates" render={() => <Rates />} />
                <Route exact path="/admin/zones" render={() => <Zones />} />
                <Route
                  exact
                  path="/admin/zones/:zone"
                  render={() => <ZonesEdit />}
                />
                <Route
                  exact
                  path="/admin/services"
                  render={() => <ManageServices />}
                />
                <Route
                  exact
                  path="/admin/services/:id"
                  render={() => <ManageServicesEdit />}
                />
                <Route exact path="/admin" render={() => <Control />} />

                <ul
                  className="list-group list-group-horizontal lg-currencies"
                  style={{ display: '' }}
                >
                  <li
                    onClick={() => this.props.store.setCurrency('EUR')}
                    className={`list-group-item ${
                      store.currency === 'EUR' ? 'active' : ''
                    }`}
                  >
                    €
                  </li>
                  <li
                    onClick={() => this.props.store.setCurrency('USD')}
                    className={`list-group-item ${
                      store.currency === 'USD' ? 'active' : ''
                    }`}
                  >
                    $
                  </li>
                  <li
                    onClick={() => this.props.store.setCurrency('RUB')}
                    className={`list-group-item ${
                      store.currency === 'RUB' ? 'active' : ''
                    }`}
                  >
                    ₽
                  </li>
                  <li
                    onClick={() => this.props.store.setCurrency('CNY')}
                    className={`list-group-item ${
                      store.currency === 'CNY' ? 'active' : ''
                    }`}
                  >
                    ¥
                  </li>
                </ul>

                <div style={{ display: 'none' }}>
                  {NavBarLinks.map((nav) => (
                    <a
                      key={nav.link}
                      href={nav.link}
                      onClick={(e) =>
                        this.changeModule(e, nav.link, nav.component)
                      }
                      className="list-group-item list-group-item-action bg-light"
                    >
                      {nav.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <Footer />
      </Router>
    );
  }
}

export default withRouter(App);

function App() {
  const store = useContext(StoreContext);
  return useObserver(() => (
    <Provider store={store}>
      <Main />
    </Provider>
  ));
}

ReactDOM.render(
  <StoreContext.Provider value={storeInstance}>
    <App />
  </StoreContext.Provider>,
  document.getElementById('app')
);


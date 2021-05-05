import React, { Component } from 'react';

import Loader from './Loader';
import 'bootstrap/dist/css/bootstrap.min.css';
import { observer, inject } from 'mobx-react';
import { SEARCH_URI_V2 } from '@/constants';

@inject('store')
@observer
class Rates extends Component {
  constructor() {
    super();

    this.state = {
      rates: [],
      isLoading: true
    };
  }
  componentDidMount = () => {
    this.RatesList();
    const { store } = this.props;
    store.changePageIndex('rates');
  };

  RatesList = (query) => {
    this.setState({ isLoading: true });
    fetch(`${SEARCH_URI_V2}/rates`)
      .then((resp) => resp.json())
      .then((items) => {
        this.setState({
          rates: items.rates,
          isLoading: false
        });
      });
  };

  renderCarrier(carrier) {
    switch (carrier) {
      case 'car':
        return 'Автомобильная перевозка';
      case 'sea':
        return 'Морская перевозка';
      case 'avia':
        return 'Авиафрахт';
      case 'rails':
        return 'Железнодорожная перевозка';
      default:
        return 'UNKNOWN';
    }
  }

  renderRegional(region) {
    switch (region) {
      case 'europe':
        return 'Европейский союз';
      case 'asia':
        return 'Азиатский регион';
      case 'usa':
        return 'США';
      case 'russia':
        return 'Российская федерация';
      default:
        return 'WORLDWIDE';
    }
  }

  handleInput = (e, metric) => {
    let { rates } = this.state;
    const index = rates.findIndex(
      (x) => x.id === e.target.name.replace(`rate_${metric}_`, '')
    );

    console.log(index, metric, e.target.name.replace(`rate_${metric}_`, ''));
    rates[index][`rate_${metric}`] = e.target.value || '';

    this.setState({ rates: rates });
  };

  saveRates = () => {
    const { rates } = this.state;
    this.setState({ isLoading: true });
    fetch(`${SEARCH_URI_V2}/rates`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        rates: rates
      })
    })
      .then((resp) => resp.json())
      .then((res) => {
        this.setState({ isLoading: false });
      });
  };

  render() {
    const { isLoading, rates } = this.state;

    return (
      <div className="container-md pl-3 pr-3" align="">
        {isLoading ? (
          <Loader promt="Пожалуйста, подождите..." />
        ) : (
          <div>
            <h2 className="pt-3 pb-3 pl-3">Вспомогательные плечи</h2>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                {' '}
                <div className="row">
                  <div className="col-lg-3 col-md-6"/>
                  <div className="col-lg-3 col-md-12">Цена за КГ</div>
                  <div className="col-lg-3 col-md-12">
                    Цена за М<sup>3</sup>
                  </div>
                  <div className="col-lg-3 col-md-12">Цена за LDM</div>
                </div>
              </li>

              {rates.map((rate) => (
                <li className="list-group-item">
                  <div className="row">
                    <div className="col-lg-3 col-md-6 pt-2 pl-3">
                      <h4>{rate.zoneName}</h4>
                      <h5>{rate.serviceName}</h5>
                    </div>
                    <div className="col-lg-3 col-md-12">
                      <div className="input-group input-group-lg">
                        <input
                          type="text"
                          className="fc"
                          name={`rate_kg_${rate.id}`}
                          value={rate.rate_kg}
                          onChange={(e) => this.handleInput(e, 'kg')}
                        />
                        &nbsp; <span className="mt-3">€</span>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-12">
                      <div className="input-group input-group-lg">
                        <input
                          type="text"
                          className="fc"
                          name={`rate_m_${rate.id}`}
                          value={rate.rate_m}
                          onChange={(e) => this.handleInput(e, 'm')}
                        />
                        &nbsp; <span className="mt-3">€</span>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-12">
                      <div className="input-group input-group-lg">
                        <input
                          type="text"
                          className="fc"
                          name={`rate_ldm_${rate.id}`}
                          value={rate.rate_ldm}
                          onChange={(e) => this.handleInput(e, 'ldm')}
                        />
                        &nbsp; <span className="mt-3">€</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 mb-5 text-center">
              <button
                type="button"
                className="modal-win btn-style main-btn"
                style={{ margin: '0 auto' }}
                onClick={() => this.saveRates()}
              >
                Обновить цены
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }
}

export default Rates;

import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { observer, inject } from 'mobx-react';
import history from '../history';
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
class ZonesEdit extends Component {
  constructor() {
    super();

    this.state = {
      zone: {},
      isLoading: false,
      id: history.location.pathname.match(/[^/?]*[^/?]/g)[2],
      demo: [],
      type: 1,
      typeTransaction: 1
    };
  }
  componentDidMount = () => {
    const { store } = this.props;
    store.changePageIndex('regions');
    this.zonesList(this.state.id);
  
  };

  zonesList = (slug) => {
    this.setState({ isLoading: true });
    fetch(`${SEARCH_URI_V2}/zones?zone=${slug}`)
      .then((resp) => resp.json())
      .then((items) => {
        this.setState({
          zone: items.zone,
          isLoading: false
        });
      });
  };

  handleRegional = (slug)=> {
    this.setState({
      selected: slug,
      isLoading: true
    });
    this.zonesList(slug);
  };

  render() {
    const {
      isLoading,
      zone,
      selected,
      demo,
      type,
      typeTransaction,
      id
    } = this.state;
    const { store } = this.props;
    let uniq = [...new Set(demo)];
    return (
      <div className="container-md pl-3 pr-3" align="">
        {isLoading ? (
          <Loader promt="Загружаю..." />
        ) : (
          <div>
            <h2
              className="mt-2 mb-3"
              onClick={() => this.setState({ selected: false })}
            >
              Редактирование региона
            </h2>

            <div>
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link active"
                    id="home-tab"
                    data-toggle="tab"
                    href="#home"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    Данные
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link"
                    id="profile-tab"
                    data-toggle="tab"
                    href="#profile"
                    role="tab"
                    aria-controls="profile"
                    aria-selected="false"
                  >
                    Загруженные города
                  </a>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <label for="name">Название услуги</label>
                      <input
                        type="text"
                        placeholder=""
                        className="form-control"
                        value={zone.name}
                        disabled
                        onChange={(e) => this.handleInput(e, 'name')}
                      />
                    </li>

                    <li className="list-group-item">
                      <label for="slug">Цена за услугу</label>
                      <div className="input-group input-group-lg">
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-lg"
                          >
                            €
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder=""
                          className="form-control"
                          value={zone.rate}
                          onChange={(e) => this.handleInput(e, 'rate')}
                        />
                      </div>
                    </li>
                    <li className="list-group-item">
                      <label for="slug">Действие</label>
                      <div className="list-group">
                        <button
                          onClick={(e) => this.changeTransaction(e, 1)}
                          type="button"
                          align="center"
                          className={`list-group-item list-group-item-action ${
                            typeTransaction === 1 && 'active'
                          }`}
                        >
                          Умножить цену региона на объем груза
                        </button>
                        <button
                          onClick={(e) => this.changeTransaction(e, 2)}
                          type="button"
                          className={`list-group-item list-group-item-action ${
                            typeTransaction === 2 && 'active'
                          }`}
                        >
                          Прибавить к итоговой цене перевозки
                        </button>
                      </div>
                    </li>
                    <li className="list-group-item">
                      <button type="button" className="btn btn-success btn-lg">
                        {id === 'add' ? 'Добавить' : 'Сохранить'}
                      </button>
                    </li>
                  </ul>
                </div>
                <div
                  className="tab-pane fade"
                  id="profile"
                  role="tabpanel"
                  aria-labelledby="profile-tab"
                >
                  <ul className="list-group list-group-flush">
                    {zone.zones && zone.zones.length ? (
                      zone.zones.map((zone, i) => (
                        <li className="list-group-item">
                          {i + 1}. {zone.country} (
                          {zone.total_cities
                            .toString()
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')}{' '}
                          {declOfNum(zone.total_cities, [
                            'город',
                            'города',
                            'городов'
                          ])}
                          )
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item">
                        <p className="alert alert-danger">
                          Добавление городов по отдельности недопустимо.
                        </p>
                        <p className="alert alert-success">
                          Только системный администратор или специалист по
                          работе с Базами данных может загрузить набор городов
                          необходимой страны во избежании повреждения
                          целостности данных.
                        </p>
                      </li>
                    )}{' '}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    );
  }
}

@inject('store')
@observer
class Zones extends Component {
  constructor() {
    super();

    this.state = {
      zones: [],
      info: [],
      selected: '',
      isLoading: false,

      demo: []
    };
  }
  componentDidMount = () => {
    const { store } = this.props;
    store.changePageIndex('regions');
    this.zonesList('');

  };

  zonesList = (slug) => {
    this.setState({ isLoading: true });
    fetch(`${SEARCH_URI_V2}/zones?zone=${slug}`)
      .then((resp) => resp.json())
      .then((items) => {
        this.setState({
          zones: items.zones,
          info: items.zone,
          isLoading: false
        });
      });
  };

  handleRegional = (slug) => {
    history.push('/admin/zones/' + slug);
  };

  render() {
    const { isLoading, zones, info, selected, demo } = this.state;
    const { store } = this.props;
    let uniq = [...new Set(demo)];

    //   onClick={() => this.handleRegional(zone.slug)}
    return (
      <div className="container-md pl-3 pr-3" align="">
        {isLoading ? (
          <Loader promt="Загружаю..." />
        ) : (
          <div>
            <h2 className="pt-3 pb-3 pl-3">Районы</h2>

            <div className="mt-2 mb-5 pl-3 pr-3 fl-block no">
              Добавление городов должно выполняться специалистом во избежании
              повреждения целостности данных.
              <br />
              Обратитесь к системному администратору или специалисту по работе с
              Базами данных.
            </div>

            {!selected && (
              <ul className="fl-ul row h-100 pl-3 pr-3">
                {zones.map((zone) => (
                  <li className="col-lg-4 col-sm-6 col-xs-12">
                    <div>
                      {zone.total_cities}{' '}
                      {declOfNum(zone.total_cities, [
                        'город',
                        'города',
                        'городов'
                      ])}{' '}
                      из {zone.total_countries}{' '}
                      {declOfNum(zone.total_countries, [
                        'страны',
                        'стран',
                        'стран'
                      ])}
                    </div>

                    <div className="pl-3 mr-3 fl-block no">
                      <h2 className="mb-1">{zone.name}</h2>

                      <h4>
                        <span style={{ display: 'none' }}>
                          Цена за 1 единицу груза × €{zone.rate} × {zone.ratio}%
                        </span>
                        {zone.includes.map((item, i) => (
                          <span>
                            {item.country}
                            {i < zone.includes.length - 1 && ','}{' '}
                          </span>
                        ))}
                      </h4>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {selected && (
              <div>
                <div className="form-group" style={{ display: 'none' }}>
                  <MagicCountry id="fromCountry" placeholder={'Страна'} />
                </div>
                <div className="form-group" style={{}}>
                  {store.calculate.fromCountry.id && (
                    <MagicCity id="fromCity" placeholder={'Город'} />
                  )}
                </div>

                <div className="mt-5 mb-5" style={{ display: 'none' }}>
                  <button type="button" className="btn btn-success btn-lg">
                    Добавить
                  </button>
                </div>

                <h2>{info.name}</h2>
                <ul className="list-group list-group-flush">
                  {zones.length ? (
                    zones.map((zone, i) => (
                      <li className="list-group-item">
                        {i + 1}. {zone.country} (
                        {zone.total_cities
                          .toString()
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')}{' '}
                        {declOfNum(zone.total_cities, [
                          'город',
                          'города',
                          'городов'
                        ])}
                        )
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item">Не добавлены города</li>
                  )}{' '}
                </ul>
              </div>
            )}

       
          </div>
        )}
      </div>
    );
  }
}

export { Zones, ZonesEdit };

import React, { Component, SyntheticEvent } from 'react';
import '../css/calculate.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import history from '../history';
import { observer, inject } from 'mobx-react';
import Stepper from 'react-stepper-horizontal';
import MagicCountry from '../elements/Country';
import MagicCity from '../elements/City';

export function declOfNum(number, words) {
  return words[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? number % 10 : 5]
  ];
}

@inject('store')
@observer
export default class Calculate extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      package: 'boxes',
      carriages: [
        {
          i: 0,
          carriages: {
            package: 'boxes',
            containerType: '20',
            units: 1,
            weight: 1,
            length: 1,
            width: 1,
            height: 1
          }
        }
      ],
      metric: 'cm',
      weight_metric: 'kg'
    };
  }
  componentDidMount = () => {};

  changePackage = (e, value, parent) => {
    let tag = value;
    e.target.parentElement
      .querySelectorAll('.active')
      .forEach((e) => e.classList.remove('active'));
    e.target.setAttribute(
      'class',
      'list-group-item list-group-item-action active'
    );
    const { carriages } = this.state;
    carriages[parent].carriages = Object.assign(
      { ...carriages[parent].carriages },
      { package: tag }
    );
    this.setState(carriages);
  };

  changeType = (e, val) => {
    let tag = e.currentTarget.dataset.package;
    e.target.parentElement
      .querySelectorAll('.active')
      .forEach((e) => e.classList.remove('active'));
    e.target.setAttribute(
      'class',
      'list-group-item list-group-item-action active'
    );
    this.setState({ package: val });
  };

  addUnit = () => {
    const { carriages } = this.state;

    this.setState({
      carriages: carriages.concat([
        {
          i: carriages.length,
          carriages: {
            package: 'boxes',
            containerType: '20',
            units: 0,
            weight: 0,
            length: 0,
            width: 0,
            height: 0
          }
        }
      ])
    });
  };

  removeUnit = (valueToRemove) => {
    const { carriages } = this.state;
    let array = carriages;
    array.splice(
      array.findIndex((item) => item.i === valueToRemove),
      1
    );
    this.setState({ carriages: array });
  };

  changeContainerType = (e, key, parent, val = '') => {
    let tag = e.currentTarget.dataset.package;
    e.target.parentElement
      .querySelectorAll('.active')
      .forEach((e) => e.classList.remove('active'));
    e.target.setAttribute(
      'class',
      'list-group-item list-group-item-action active'
    );
    this.handleInput(e, key, parent, val);
  };

  handleInput = (e, key, parent, val = '') => {
    const { carriages } = this.state;
    carriages[parent].carriages = Object.assign(
      { ...carriages[parent].carriages },
      { [key]: e.target.value || val }
    );
    this.setState(carriages);
  };

  changePallet = (e, parent) => {
    const standartize_pallet = () => {
      switch (e.target.value) {
        case 'standard':
          return { length: 40, width: 40 };
        case 'euro1':
          return { length: 120, width: 80 };
        case 'euro2':
          return { length: 120, width: 100 };
        case 'other':
          return { length: '', width: '' };
        default:
          return { length: '', width: '' };
      }
    };

    const { carriages } = this.state;
    carriages[parent].carriages = Object.assign(
      { ...carriages[parent].carriages },
      {
        package: 'pallets_selected',
        ...standartize_pallet()
      }
    );
    this.setState(carriages);
  };

  render() {
    const { store } = this.props;
    const { carriages, metric, weight_metric } = this.state;
    const package_k = this.state.package;

    let total = {
      weight: 0,
      volume: 0,
      units: 0
    };

    return (
      <div className="container-fluid">
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
          defaultBarColor={'#b5c7d8'}
          defaultBorderWidth={'30px'}
          circleFontSize={20}
          lineMarginOffset={18}
          titleFontSize={'PTSansBold, sans-serif'}
          completeTitleColor={'#187ce0'}
          completeColor={'#187ce0'}
          activeStep={0}
        />

        <ul className="list-group list-group-flush stepper pl-2 pr-5">
          <li className="list-group-item fl-block rounded rounded-spacing">
            <div className="w-100">
              <div className="row nom">
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <h2 className="mb-1">Груз</h2>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 mb-3">
                  <div className="list-group list-group-horizontal">
                    <button
                      onClick={(e) => this.changeType(e, 'boxes')}
                      type="button"
                      className="list-group-item list-group-item-action active"
                    >
                      Коробки
                    </button>
                    <button
                      onClick={(e) => this.changeType(e, 'containers')}
                      type="button"
                      className="list-group-item list-group-item-action"
                    >
                      Контейнеры
                    </button>
                    {!1 && (
                      <button
                        onClick={(e) => this.changeType(e, 'total_shipment')}
                        type="button"
                        className="list-group-item list-group-item-action"
                      >
                        Total Shipment
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {carriages.map((carriage, i) => {
                total = {
                  units: Number(total.units) + Number(carriage.carriages.units),
                  weight:
                    Number(total.weight) +
                    Number(carriage.carriages.weight) *
                      carriage.carriages.units,
                  volume:
                    Number(total.volume) +
                    Number(carriage.carriages.length) *
                      Number(carriage.carriages.width) *
                      Number(carriage.carriages.height) *
                      carriage.carriages.units
                };

                return (
                  <div key={i}>
                    {package_k === 'boxes' && (
                      <div className="row carriage nom">
                        <div className="bl-1 col-lg-3 col-md-6 col-sm-12 col-xs-12 mt-2 pr-3">
                          <div
                            className="list-group text-center"
                            style={{ borderRadius: '20px' }}
                          >
                            <button
                              onClick={(e) => this.changePackage(e, 'boxes', i)}
                              type="button"
                              className={`list-group-item text-center list-group-item-action ${
                                carriage.carriages.package === 'boxes' &&
                                'active'
                              }`}
                            >
                              Коробки
                            </button>
                            <button
                              onClick={(e) =>
                                this.changePackage(e, 'pallets', i)
                              }
                              type="button"
                              className={`list-group-item list-group-item-action ${
                                carriage.carriages.package !== 'boxes' &&
                                'active'
                              }`}
                            >
                              Паллеты
                            </button>
                          </div>
                        </div>
                        <div className="bl-2 col-lg-5 col-md-12 col-sm-12 col-xs-12 pt-3">
                          {carriage.carriages.package === 'pallets' ? (
                            <div>
                              <label>Тип паллетов</label>
                              <select
                                className="form-control"
                                style={{ maxWidth: '90%' }}
                                onChange={(e) => this.changePallet(e, i)}
                              >
                                <option value="" selected>
                                  Выберите
                                </option>
                                <option value="standard">48'' на 40''</option>
                                <option value="euro1">120 на 80</option>
                                <option value="euro2">120 на 100</option>
                                <option value="other">Указать размер</option>
                              </select>
                            </div>
                          ) : (
                            <ul className="list-group list-group-horizontal list-group-horizontal-sm number-center">
                              <li className="list-group-item">
                                <label>Штуки</label>
                                <input
                                  type="text"
                                  className="fc"
                                  placeholder="шт."
                                  value={carriage.carriages.units}
                                  onChange={(e) =>
                                    this.handleInput(e, 'units', i)
                                  }
                                />
                              </li>
                              <li className="list-group-item">
                                <label>Длина</label>
                                <input
                                  type="text"
                                  placeholder="Д"
                                  id="length"
                                  className="fc"
                                  value={carriage.carriages.length}
                                  onChange={(e) =>
                                    this.handleInput(e, 'length', i)
                                  }
                                />
                              </li>
                              <li className="list-group-item">
                                <label>Ширина</label>
                                <input
                                  type="text"
                                  placeholder="Ш"
                                  id="width"
                                  className="fc"
                                  value={carriage.carriages.width}
                                  onChange={(e) =>
                                    this.handleInput(e, 'width', i)
                                  }
                                />
                              </li>
                              <li className="list-group-item">
                                <label>Высота</label>
                                <input
                                  type="text"
                                  placeholder="В"
                                  id="height"
                                  className="fc"
                                  value={carriage.carriages.height}
                                  onChange={(e) =>
                                    this.handleInput(e, 'height', i)
                                  }
                                />
                              </li>
                              <li className="list-group-item">
                                <label>&nbsp;</label>
                                <select
                                  id="metric"
                                  className="fc form-control fc-set"
                                  onChange={(e) =>
                                    this.setState({ metric: e.target.value })
                                  }
                                >
                                  <option value="cm" selected={metric === 'cm'}>
                                    см3
                                  </option>
                                  <option value="m" selected={metric === 'm'}>
                                    м3
                                  </option>
                                </select>
                              </li>
                            </ul>
                          )}
                          {carriage.carriages.package !== 'boxes' ? (
                            <div className="center">Размеры 1 паллеты</div>
                          ) : (
                            <div className="center">Размеры 1 коробки</div>
                          )}
                        </div>
                        <div className="bl-3 col-lg-2 col-md-6 col-sm-6 col-xs-12 mt-3">
                          <ul className="list-group list-group-horizontal list-group-horizontal-sm number-center">
                            <li className="list-group-item">
                              <label>Вес</label>
                              <input
                                type="text"
                                className="fc"
                                value={carriage.carriages.weight}
                                onChange={(e) =>
                                  this.handleInput(e, 'weight', i)
                                }
                              />
                            </li>
                            <li className="list-group-item">
                              <label>&nbsp;</label>
                              <select
                                className="fc form-control fc-set"
                                id="weight_metric"
                                onChange={(e) =>
                                  this.setState({
                                    weight_metric: e.target.value
                                  })
                                }
                              >
                                <option
                                  value="kg"
                                  selected={weight_metric === 'kg'}
                                >
                                  кг
                                </option>
                                <option
                                  value="lb"
                                  selected={weight_metric === 'lb'}
                                >
                                  lb
                                </option>
                              </select>
                            </li>
                          </ul>
                          {carriage.carriages.package !== 'boxes' ? (
                            <div>За 1 паллету</div>
                          ) : (
                            <div>За 1 коробку</div>
                          )}
                        </div>
                        <div
                          className="bl-4 col-lg-1 col-md-6 col-sm-6 col-xs-12 mt-2"
                          style={{ paddingTop: 40 }}
                        >
                          {i !== 0 && (
                            <button
                              onClick={() => this.removeUnit(i)}
                              type="button"
                              className="btn btn-danger"
                            >
                              Удалить
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    {package_k === 'containers' && (
                      <div className="row carriage nom">
                        <div className="bl-2 col-lg-2 col-md-12 col-sm-12 col-xs-12 mt-2">
                          <ul className="list-group list-group-horizontal noright list-group-horizontal-sm number-center">
                            <li className="list-group-item input-group-lg">
                              <label>Количество</label>
                              <input
                                type="text"
                                placeholder="1"
                                value={carriage.carriages.quantity}
                                className="text-center"
                                onChange={(e) =>
                                  this.handleInput(e, 'quantity', i)
                                }
                              />
                            </li>
                          </ul>
                        </div>
                        <div className="bl-2 col-lg-7 col-md-12 col-sm-12 col-xs-12 mt-2">
                          <label>Тип контейнера</label>

                          <div className="list-group list-group-horizontal">
                            <button
                              onClick={(e) =>
                                this.changeContainerType(
                                  e,
                                  'containerType',
                                  i,
                                  '20'
                                )
                              }
                              type="button"
                              className={`list-group-item list-group-item-action ${
                                carriage.carriages.containerType === '20' &&
                                'active'
                              }`}
                            >
                              20'
                            </button>
                            <button
                              onClick={(e) => {
                                this.changeContainerType(
                                  e,
                                  'containerType',
                                  i,
                                  '40'
                                );
                              }}
                              type="button"
                              className={`list-group-item list-group-item-action ${
                                carriage.carriages.containerType === '40' &&
                                'active'
                              }`}
                            >
                              40'
                            </button>
                            <button
                              onClick={(e) =>
                                this.changeContainerType(
                                  e,
                                  'containerType',
                                  i,
                                  '40HC'
                                )
                              }
                              type="button"
                              className={`list-group-item list-group-item-action ${
                                carriage.carriages.containerType === '40HC' &&
                                'active'
                              }`}
                            >
                              40'HC
                            </button>
                            <button
                              onClick={(e) =>
                                this.changeContainerType(
                                  e,
                                  'containerType',
                                  i,
                                  '45HC'
                                )
                              }
                              type="button"
                              className={`list-group-item list-group-item-action ${
                                carriage.carriages.containerType === '45HC' &&
                                'active'
                              }`}
                            >
                              45'HC
                            </button>
                          </div>
                        </div>
                        <div
                          className="bl-3 col-lg-2 col-md-6 col-sm-6 col-xs-12 mt-2 text-center"
                          style={{ paddingTop: 30 }}
                        >
                          {i !== 0 && (
                            <button
                              onClick={() => this.removeUnit(i)}
                              type="button"
                              className="btn btn-danger"
                            >
                              Удалить
                            </button>
                          )}

                          <div
                            className="form-check mt-5"
                            style={{ display: 'none' }}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              id="defaultCheck1"
                            />
                            <label className="form-check-label">
                              Возможен перевес
                            </label>
                          </div>
                        </div>
                        <div className="bl-4 col-lg-2 col-md-6 col-sm-6 col-xs-12 mt-2 pt-3"/>
                      </div>
                    )}
                    {package_k !== 'total_shipment' && <hr />}
                  </div>
                );
              })}
              {package_k !== 'total_shipment' && (
                <div className="row carriage nom">
                  <div className="bl-6 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div style={{ float: 'left' }}>
                      <button
                        onClick={() => this.addUnit()}
                        type="button"
                        className="modal-win btn-style main-btn mini"
                      >
                        Добавить грузовую единицу
                      </button>
                    </div>
                    <div className="text-right" style={{ paddingTop: 20 }}>
                      Всего {total.units}{' '}
                      {declOfNum(total.units, ['штука', 'штуки', 'штук'])}, вес{' '}
                      {weight_metric === 'lb'
                        ? total.weight * 2.205
                        : total.weight}{' '}
                      КГ, объём{' '}
                      {metric === 'cm' ? total.volume / 1000000 : total.volume}{' '}
                      M<sup>3</sup>
                    </div>
                  </div>
                </div>
              )}
              {package_k === 'total_shipment' && (
                <div className="row carriage nom mt-2 mb-4">
                  <div className="bl-2 col-lg-2 col-md-12 col-sm-12 col-xs-12">
                    <ul className="list-group list-group-horizontal noright list-group-horizontal-sm number-center">
                      <li className="list-group-item input-group-lg">
                        <label>Quantity</label>
                        <input
                          type="text"
                          placeholder="1"
                          className="form-control form-control-sm"
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="bl-2 col-lg-5 col-md-12 col-sm-12 col-xs-12">
                    <ul className="list-group list-group-horizontal list-group-horizontal-sm number-center">
                      <li className="list-group-item">
                        <label>Volume</label>
                        <input
                          type="text"
                          placeholder="1"
                          className="form-control"
                          onChange={(e) =>
                            this.handleInput(e, 'totalVolume', 0)
                          }
                        />
                      </li>
                      <li className="list-group-item">
                        <label>&nbsp;</label>
                        <select className="form-control" id="weight_metric">
                          <option>cbm</option>
                          <option selected>cft</option>
                        </select>
                      </li>
                    </ul>
                  </div>
                  <div className="bl-2 col-lg-4 col-md-12 col-sm-12 col-xs-12">
                    <ul className="list-group list-group-horizontal list-group-horizontal-sm number-center">
                      <li className="list-group-item">
                        <label>Weight</label>
                        <input
                          type="text"
                          placeholder="1"
                          className="form-control"
                          onChange={(e) =>
                            this.handleInput(e, 'totalWeight', 0)
                          }
                        />
                      </li>
                      <li className="list-group-item">
                        <label>&nbsp;</label>
                        <select className="form-control" id="weight_metric">
                          <option>kg</option>
                          <option selected>lb</option>
                        </select>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </li>
          <li className="list-group-item fl-block rounded rounded-spacing">
            <div className="row d-flex w-100 justify-content-between">
              <div className="col-md-6 pr-3">
                <h2 className="mb-1 text-center pb-3">Забрать груз</h2>
              </div>
              <div className="col-md-6 pl-3">
                {' '}
                <h2 className="mb-1 text-center pb-3">Доставить до</h2>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-6 pr-3">
                <div className="form-group">
                  <select
                    className="custom-select custom-select-lg"
                    style={{ maxWidth: '90%' }}
                    onChange={(e) => this.handleInput(e, 'fromPickup', 0)}
                  >
                    <option selected value="warehouse">
                      Со склада
                    </option>
                    <option value="aport">Порт / Аэропорт (FOB)</option>
                    <option value="business">Промышленная территория</option>
                    <option value="residential">Представительство</option>
                  </select>
                </div>
                <div className="form-group">
                  <MagicCountry id="fromCountry" placeholder={'Страна'} />
                </div>
                <div className="form-group" style={{}}>
                  {store.calculate.fromCountry.id && (
                    <MagicCity id="fromCity" placeholder={'Город'} />
                  )}
                </div>
              </div>
              <div className="col-6 pl-3">
                <div className="form-group">
                  <select
                    className="custom-select custom-select-lg"
                    style={{ maxWidth: '90%' }}
                    onChange={(e) => this.handleInput(e, 'toPickpoint', 0)}
                  >
                    <option selected value="warehouse">
                      До склада
                    </option>
                    <option value="aport">Порт / Аэропорт (FOB)</option>
                    <option value="business">Промышленная территория</option>
                    <option value="residential">Представительство</option>
                  </select>
                </div>
                <div className="form-group">
                  <MagicCountry id="toCountry" placeholder={'Страна'} />
                </div>
                <div className="form-group">
                  {store.calculate.toCountry.id && (
                    <MagicCity id="toCity" placeholder={'Город'} />
                  )}
                </div>
              </div>
            </div>
          </li>
          <li className="list-group-item fl-block rounded rounded-spacing form-check">
            <div className="d-flex w-100 justify-content-between">
              <h2 className="mb-1">Таможенное оформление</h2>
            </div>
            <div className="custom-control custom-radio">
              <input
                type="radio"
                id="yesCustoms"
                name="customs"
                className="custom-control-input"
              />
              <label className="custom-control-label">
                Да, мне необходимо таможенное оформление
              </label>
            </div>
            <div className="custom-control custom-radio">
              <input
                type="radio"
                name="customs"
                id="noCustoms"
                checked
                className="custom-control-input"
              />
              <label className="custom-control-label">
                Нет, у меня есть таможенный брокер
              </label>
            </div>
          </li>
          <li className="list-group-item fl-block rounded rounded-spacing">
            <div className="d-flex w-100 justify-content-between">
              <h2 className="mb-1">Страхование груза</h2>
            </div>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="insurance"
              />
              <label className="custom-control-label">
                Оформить страхование
              </label>
            </div>
          </li>
        </ul>

        <div className="row justify-content-center mt-3">
          <button
            type="button"
            onClick={() => {
              store.searchForm({
                calculate: store.calculate,
                total: total,
                options: this.state
              });
              history.push('/search/results');
            }}
            className="modal-win btn-style main-btn"
          >
            Рассчитать стоимость
          </button>
        </div>
      </div>
    );
  }
}

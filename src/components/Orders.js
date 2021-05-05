import React, { Component} from 'react';
import OfferForm from './OfferForm';
import Loader from './Loader';
import 'bootstrap/dist/css/bootstrap.min.css';
import { observer, inject } from 'mobx-react';

import { SEARCH_URI_V2 } from '@/constants';

@inject('store')
@observer
class Orders extends Component {
  constructor() {
    super();

    this.state = {
      orders: [],
      isLoading: true
    };
  }
  componentDidMount = () => {
    this.OrderList();
    const { store } = this.props;
    store.changePageIndex('orders');
  };

  deleteOrder = (id) => {
    this.setState({
      isLoading: true
    });
    fetch(`${SEARCH_URI_V2}/orders/${id}`, {
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
        this.OrderList();
      });
  };

  OrderList = (query) => {
    this.setState({ isLoading: true });
    fetch(`${SEARCH_URI_V2}/orders`)
      .then((resp) => resp.json())
      .then((items) => {
        this.setState({
          orders: items.orders,
          isLoading: false
        });
      });
  };

  render() {
    const { orders, isLoading } = this.state;

    const OrderList = () => (
      <React.Fragment>
        <h2 className="pl-3 title text-center">Личный кабинет</h2>
        <h4 className="pl-3 subtitle text-center">
          Мы собрали в одном месте все Ваши заказы
        </h4>
        <ul className="pl-3 pt-5 pr-3 fl-ul">
          {orders.map((order) => {
            return (
              <React.Fragment>
                <h3 className="text-center">
                  Заказ №<b>{order.id}</b> от{' '}
                  {new Date(order.created).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </h3>
                <li className="fl-block rounded rounded-spacing mb-5">
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <h3 className="pb-3">Грузоотправитель</h3>
                      <p>
                        Email: <b>{order.sh_email || 'не указано'}</b>
                      </p>
                      <p>
                        Телефон: <b>{order.sh_phone || 'не указано'}</b>
                      </p>
                      <p>
                        Компания: <b>{order.sh_company || 'не указано'}</b>
                      </p>
                      <p>
                        Индекс: <b>{order.sh_zipcode || 'не указано'}</b>
                      </p>
                      <p>
                        Адрес: <b>{order.sh_address || 'не указано'}</b>
                      </p>
                      <p>
                        Контактное лицо:{' '}
                        <b>{order.sh_contacter || 'не указано'}</b>
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <h3 className="pb-3">Грузополучатель</h3>
                      <p>
                        Email: <b>{order.rec_email || 'не указано'}</b>
                      </p>
                      <p>
                        Телефон: <b>{order.rec_phone || 'не указано'}</b>
                      </p>
                      <p>
                        Компания: <b>{order.rec_company || 'не указано'}</b>
                      </p>
                      <p>
                        Индекс: <b>{order.rec_zipcode || 'не указано'}</b>
                      </p>
                      <p>
                        Адрес: <b>{order.rec_address || 'не указано'}</b>
                      </p>
                      <p>
                        Контактное лицо:{' '}
                        <b>{order.rec_contacter || 'не указано'}</b>
                      </p>
                    </div>
                    <div
                      className="col-lg-4 col-md-4 col-sm-12 col-xs-12 pt-3"
                      style={{ paddingTop: 15 }}
                    >
                      <p>
                        <a
                          className="modal-win btn-style main-btn  mini cursor"
                          onClick={() => {
                            this.props.store.modalToggle({
                              id: 'details_route',
                              name: 'Подробный маршрут',
                              data: order,
                              round: false
                            });
                          }}
                        >
                          Подробный маршрут
                        </a>
                      </p>
                      <p>
                        <a
                          onClick={() => {
                            this.props.store.modalToggle({
                              id: 'details_carriage',
                              name: 'Информация о грузе',
                              order: order,
                              round: false
                            });
                          }}
                          className="modal-win btn-style main-btn mini cursor"
                        >
                          Информация о грузе
                        </a>
                      </p>
                      <p className="pt-3">
                        <a
                          onClick={() => {
                            this.deleteOrder(order.id);
                          }}
                          className="modal-win btn-style main-btn mini cursor red"
                        >
                          Отменить заказ
                        </a>
                      </p>
                    </div>
                  </div>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </React.Fragment>
    );

    return (
      <div className="container-md" align="">
        {isLoading ? (
          <Loader promt="Загружаю заказы..." />
        ) : (
          <div>
            {orders.length ? (
              <OrderList />
            ) : (
              <div align="center">
                <br />
                <br />
                <br />
                <br />
                Нет оформленных заказов
              </div>
            )}
          </div>
        )}
        <OfferForm />
      </div>
    );
  }
}

export default Orders;

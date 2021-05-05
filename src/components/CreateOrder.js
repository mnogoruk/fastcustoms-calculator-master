import React from 'react';
import Loader from './Loader';
import 'bootstrap/dist/css/bootstrap.min.css';
import { observer, inject } from 'mobx-react';
import history from '../history';
import Stepper from 'react-stepper-horizontal';
import DrawRoute from './DrawRoute';
import { SEARCH_URI_V2 } from '@/constants';

@inject('store')
@observer
export class InputRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {}
    };
  }
  handleInput = (e) => {
    const { store } = this.props;
    store.postOrderForm({
      field: e.target.name,
      value: e.target.value
    });
  };

  render() {
    const { id, store, name } = this.props;

    return (
      <div className="form-group">
        <div>{name}</div>
        <input
          type="text"
          className="form-control"
          id={id}
          name={id}
          value={store.form[id]}
          onChange={(e) => this.handleInput(e)}
        />
      </div>
    );
  }
}

@inject('store')
@observer
class CreateOrder extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      terminate: false
    };
  }
  componentDidMount = () => {
    const { store } = this.props
    const { total } = store;
    if (!total.weight) history.push('/');
    store.changePageIndex('createOrder');
    this.setState({ isLoading: false })
  };

  handleText = (e) => {
    const { store } = this.props;

    store.postOrderForm({
      field: e.target.name,
      value: e.target.value
    });
  };

  saveOrder = (data) => {
    fetch(`${SEARCH_URI_V2}/save`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        form: data.form,
        route: data.route,
        searchId: data.searchId
      })
    })
      .then((resp) => resp.json())
      .then((res) => {
        this.setState({ terminate: res.order_id });
      });
  };

  render() {
    const { initial } = this.props.store;

    const { orders, isLoading, terminate } = this.state;

    const OrderDone = () => (
      <React.Fragment>
        <div className="container-md pl-3 pr-3" align="center">
          <br />

          <div className="fl-block rounded rounded-spacing pt-5 pb-5">
            <h2 className="pb-5">Заказ №{terminate} принят</h2>
            <p>Специалисты нашей компании свяжутся для подтверждения заказа.</p>
          </div>
        </div>
      </React.Fragment>
    );

    const CreateOrder = () => (
      <React.Fragment>
        <div className="pl-2 pr-2">
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
            activeStep={2}
          />

          <h1 className="pl-3 pt-5 text-center">Оформление доставки</h1>
          <h4 className="pl-3 pt-2 pb-3 text-center">Выбрана доставка:</h4>

          <DrawRoute route={initial.dests} data={initial} round={true} />

          <div className="fl-block rounded rounded-spacing">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <h2 className="pb-3">Грузоотправитель</h2>
                <InputRow id={'sh_company'} name={'Компания'} />
                <InputRow id={'sh_zipcode'} name={'Индекс'} />
                <InputRow id={'sh_address'} name={'Адрес'} />
                <InputRow id={'sh_contacter'} name={'Контактное лицо'} />
                <InputRow id={'sh_phone'} name={'Телефон'} />
                <InputRow id={'sh_email'} name={'Email'} />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <h2 className="pb-3">Грузополучатель</h2>
                <InputRow id={'rec_company'} name={'Компания'} />
                <InputRow id={'rec_zipcode'} name={'Индекс'} />
                <InputRow id={'rec_address'} name={'Адрес'} />
                <InputRow id={'rec_contacter'} name={'Контактное лицо'} />
                <InputRow id={'rec_phone'} name={'Телефон'} />
                <InputRow id={'rec_email'} name={'Email'} />
              </div>
            </div>
          </div>

          <div className="row justify-content-center mt-3 mb-5">
            <button
              type="button"
              onClick={() =>
                this.saveOrder({
                  form: this.props.store.form,
                  route: this.props.store.initial,
                  searchId: this.props.store.searchId
                })
              }
              className="modal-win btn-style main-btn"
            >
              Оформить заказ
            </button>
          </div>
        </div>
      </React.Fragment>
    );

    return (
      <div className="container-md">
        {isLoading ? (
          <Loader promt="Пожалуйста, подождите..." />
        ) : (
          <React.Fragment>
            {terminate ? <OrderDone /> : <CreateOrder />}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default CreateOrder;

import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';
import Loader from './Loader';
import { SEARCH_URI_V2 } from '@/constants';

@inject('store')
@observer
export default class DrawCarriages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carriages: [],
      isLoading: true
    };
  }

  CarriagesList = () => {
    const { order } = this.props;
    const order_id = JSON.stringify(order.id);

    this.setState({ isLoading: true });
    fetch(`${SEARCH_URI_V2}/orders/${order_id}/carriages`)
      .then((resp) => resp.json())
      .then((items) => {
        this.setState({
          carriages: items.carriages,
          isLoading: false
        });
      });
  };

  componentDidMount() {
    this.CarriagesList();
  }

  handleClose() {
    this.props.store.modalToggle({ id: 0 });
  }

  render() {
    const { order } = this.props;
    const { isLoading, carriages } = this.state;

    const Items = () => {
      return (
        <React.Fragment>
          {carriages.map((item) => (
            <React.Fragment>
              <div className="row pb-5 pl-5">
                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 pt-3">
                  <div className="list-group list-group-horizontal">
                    <span className="list-group-item active nocursor">Коробки</span>
                    <span className="list-group-item">Контейнеры</span>
                  </div>
                </div>
                <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                  <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 text-center">
                      <h2>{item.units}</h2>
                      <h4 style={{ fontWeight: 'normal' }}>шт.</h4>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 text-center">
                      <h2>{item.weight}</h2>
                      <h4 style={{ fontWeight: 'normal' }}>кг</h4>
                    </div>
                    <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12 text-center pt-3">
                      <h2>
                        {item.length}×{item.width}×{item.height} М<sup>3</sup>
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </React.Fragment>
      );
    };

    return (
      <div className="fl-ul row h-100 pl-3 pr-3 w-100">
        <Modal.Body>
          <div className="container" align="center">
            {isLoading ? <Loader /> : <Items />}
          </div>
        </Modal.Body>
        <Modal.Footer style={{ display: 'none' }}>
          <Button variant="primary" onClick={() => this.handleClose()}>
            Закрыть
          </Button>
        </Modal.Footer>
      </div>
    );
  }
}

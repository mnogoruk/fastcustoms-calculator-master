import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';
import MapBox from './DrawMapbox';
import DrawLine from './DrawLine';
import DrawTable from './DrawTable';

@inject('store')
@observer
export default class DrawRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClose() {
    this.props.store.modalToggle({ id: 0 });
  }

  render() {
    const { route, data } = this.props;

    return (
      <div className="fl-ul row h-100 pl-3 pr-3 w-100">
        <Modal.Body>
          <div
            className={`row fl-block ${this.props.round ? 'rounded' : ''}`}
            style={{ padding: '0 20px', overflow: 'hidden' }}
          >
            <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12 pl-5 pt-5 pb-5">
              <DrawLine dests={route} />
            </div>
            <div className="col-lg-7 col-md-7 col-sm-12 col-xs-12">
              <MapBox route={route} zoom={3} key={1} />
            </div>
          </div>

          <div className="fl-block rounded">
            <h2 className="pl-3 pt-2">Маршрут заказа</h2>
            <DrawTable route={route} data={data} />
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

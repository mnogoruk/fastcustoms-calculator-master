import React, { Component } from 'react';

import { Modal } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import DrawRoute from './DrawRoute';
import DrawCarriages from './DrawCarriages';

import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow
});

@inject('store')
@observer
export default class OfferForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.store.modal.id
    };
  }

  handleClose() {
    this.props.store.modalToggle({ id: 0 });
  }

  saveForm() {
    this.props.store.modalToggle({ id: 0 });
  }

  render() {
    const { store } = this.props;
    const { modal } = store;
    let route = [];
    route = modal.data;
    const DetailsRoute = () => (
      <DrawRoute
        route={modal.data.dests}
        data={modal.data}
        round={this.props.round}
      />
    );
    const DetailsCarriage = () => <DrawCarriages order={modal.order} />;

    return (
      <div>
        <Modal
          show={store.modal.id}
          dialogClassName="modal-90w"
          className="modal-container custom-map-modal"
          onHide={() => this.handleClose()}
        >
          <Modal.Header closeButton>
            <Modal.Title>{modal.name}</Modal.Title>
          </Modal.Header>

          {modal.id === 'details_route' && <DetailsRoute />}
          {modal.id === 'details_carriage' && <DetailsCarriage />}
        </Modal>
      </div>
    );
  }
}

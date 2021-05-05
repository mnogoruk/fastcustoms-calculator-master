import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import {  observer, inject } from 'mobx-react';
import { methodDest } from './Search';

@inject('store')
@observer
export default class DrawTable extends Component {
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
      <div>
        <Modal.Body>
          <div className="table-responsive mt-3">
            <table className="table">
              <tbody>
                {route.map((transit, j) => {
                  if (j >= 0 && j < route.length) {
                    return (
                      <React.Fragment>
                        <tr>
                          <td width="5%" className="pt-5">
                            <br />
                            <h5>{j + 1}.</h5>
                          </td>
                          <td width="25%">
                            {methodDest(transit.carrier.slug)}{' '}
                            <h2>{transit.from.city}</h2>
                            <h4>{transit.from.country}</h4>
                          </td>
                          <td width="25%">
                            {methodDest(transit.carrier.slug)}{' '}
                            <h2>{transit.to.city}</h2>
                            <h4>{transit.to.country}</h4>
                          </td>
                          <td className="pt-5">
                            <h5>{transit.distance} км</h5>
                            {transit.duration > 24
                              ? `${(transit.duration / 24).toFixed(0)} дн.`
                              : `${transit.duration} ч.`}
                          </td>
                          <td className="pt-5">
                            <h5>
                              {
                                transit.price[
                                  this.props.store.currency.toLowerCase()
                                ]
                              }{' '}
                              {this.props.store.currency}
                            </h5>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  }
                })}
                <tr>
                  <td colSpan="2">Итого</td>
                  <td>
                    <h5>{data.weight} кг</h5> {data.volume} м<sup>3</sup>
                  </td>
                  <td>
                    <h5>{data.distance} км</h5>
                    {data.duration > 24
                      ? `${(data.duration / 24).toFixed(0)} дн.`
                      : `${data.duration} ч.`}
                  </td>
                  <td>
                    <h5>
                      {data.price[this.props.store.currency.toLowerCase()]}{' '}
                      {this.props.store.currency}
                    </h5>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </div>
    );
  }
}

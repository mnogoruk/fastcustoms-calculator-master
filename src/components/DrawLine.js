import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { observer, inject } from 'mobx-react';
import { methodDest } from './Search';

@inject('store')
@observer
export default class DrawLine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { dests } = this.props;

    return (
      <div>
        {dests.map((row, j) => {
          return (
            <React.Fragment>
              <div className="step completed">
                <div className="v-stepper">
                  <div className="circle">
                    <span>{j + 1}</span>
                  </div>
                  <div className="line"/>
                </div>

                <div className="content">
                  <h2>{row.from.city}</h2>
                  <h4>{row.from.country}</h4>
                </div>
              </div>

              {j < dests.length - 1 && (
                <React.Fragment>
                  <div className="step empty">
                    <div className="v-stepper">
                      <div className="circle"/>
                      <div className="line"/>
                    </div>
                    <div className="content" title={row.carrier.name}>
                      {methodDest(row.carrier.slug)}
                      <span>
                        {row.distance} км, {row.duration.toFixed(0)} ч.
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          );
        })}

        <div className="step empty">
          <div className="v-stepper">
            <div className="circle"/>
            <div className="line"/>
          </div>
          <div className="content">
            {methodDest(dests[dests.length - 1].carrier.slug)}
            <span>
              {dests[dests.length - 1].distance} км,{' '}
              {dests[dests.length - 1].duration.toFixed(0)} ч.
            </span>
          </div>
        </div>

        <div className="step completed">
          <div className="v-stepper">
            <div className="circle">
              <span>{dests.length + 1}</span>
            </div>
            <div className="line"/>
          </div>

          <div className="content">
            <h2>{dests[dests.length - 1].to.city}</h2>
            <h4>{dests[dests.length - 1].to.country}</h4>
          </div>
        </div>
      </div>
    );
  }
}

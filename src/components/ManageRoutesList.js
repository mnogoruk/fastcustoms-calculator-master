import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { observer, inject } from 'mobx-react';
import {SEARCH_URI_V2} from "@/constants";
import Loader from "@/components/Loader";
import history from '../history';




@inject('store')
@observer
class ManageRoutesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      routes: [],
      isLoading: false
    };
  }
  componentDidMount = () => {
    const { store } = this.props;
    store.changePageIndex('admin/routes/');
    this.RoutesList();
  };

  RoutesList = () => {
    this.setState({ isLoading: true });
    fetch(`${SEARCH_URI_V2}/routes_relations`)
      .then((resp) => resp.json())
      .then((items) => {
        this.setState({
          routes: items.routes,
          isLoading: false
        });
      });
  };

  editRoute = (id) => {
    history.push('/admin/routes/' + id);
  };

  render() {
    const { isLoading, routes } = this.state;

    return (
      <div className="container-md pl-3 pr-3" align="">
        {isLoading ? (
          <Loader promt="Загружаю..." />
        ) : (
          <div>
            <div className="row pt-3 pb-3">
              <div className="col-md-6 pl-3">
                <h2 className="mb-3">Хабовые плечи</h2>
              </div>
              <div className="col-md-6 pr-3 text-right">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => this.editRoute('add')}
                >
                  Добавить плечо
                </button>
              </div>
            </div>

            <ul className="fl-ul row h-100 pr-3 mb-5">
              {routes.map((route) => (
                <li key={route.id} className="pl-3 col-lg-6 col-xs-12 col-sm-6">
                  <span>{route.zoneName}</span>
                  <div
                    className="fl-block cursor text-center"
                    onClick={() => this.editRoute(route.id)}
                  >
                    <div className="row text-center pl-3">
                      <div className="col-lg-4 col-xs-12">
                        <h2>{route.fromCity}</h2>
                        <h4>{route.fromCountry}</h4>
                      </div>
                      <div className="col-lg-2 col-xs-12 pt-3">&rarr;</div>
                      <div className="col-lg-4 col-xs-12">
                        <h2>{route.toCity}</h2>
                        <h4>{route.toCountry}</h4>
                      </div>
                    </div>
                  </div>
                  <ul
                    className="list-group list-group-flush"
                    style={{ display: 'none' }}
                  >
                    {route.services.map((service) => (
                      <li className="list-group-item">{service.name}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default ManageRoutesList;

import React, { Fragment, Component } from 'react';
import '../css/calculate.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { observer, inject } from 'mobx-react';
import { SEARCH_URI } from '@/constants';

@inject('store')
@observer
class MagicCountry extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      options: [],
      selected: [],
      emptyLabel: 'Не найдено',
      size: 'large'
    };
  }

  componentDidMount = () => {
    this.handleSearch('');
  };

  handleSearch = (query) => {
    this.setState({ isLoading: true });
    fetch(
      `${SEARCH_URI}/api/v0.1/countries/info?returns=unicodeFlag&name=${query}`
    )
      .then((resp) => resp.json())
      .then((items) => {
        const options = items.data.map((i) => ({
          avatar_url: i.name.replace(/\s+/g, '-'),
          id: i.name,
          name: i.name,
          flag: i.unicodeFlag
        }));

        this.setState({
          options,
          isLoading: false
        });
      });
  };

  render() {
    const { options } = this.state;
    const { store, id } = this.props;

    return (
      <div>
        <Typeahead
          {...this.state}
          id={id}
          labelKey={(option) => `${option.flag} ${option.name}`}
          onChange={(selected) => {
            store.postCalculate({
              field: id,
              value: selected
            });
            this.setState({ selected });
          }}
          placeholder={this.props.placeholder}
          renderMenuItemChildren={(option, props) => (
            <Fragment>
              <span>
                {option.flag}&nbsp;&nbsp; {option.name}
              </span>
            </Fragment>
          )}
        />
      </div>
    );
  }
}

export default MagicCountry;

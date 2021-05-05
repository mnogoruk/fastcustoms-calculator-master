import React, { Fragment, Component } from 'react';
import '../css/calculate.css';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { observer, inject } from 'mobx-react';
import { SEARCH_URI } from '/constants';

@inject('store')
@observer
class MultipleCity extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      options: [],
      selected: [],
      placeholde: 'Добавить города',
      emptyLabel: 'Не найдено',
      searchText: 'Загружаю...',
      promptText: 'Выберите',
      size: 'large'
    };
  }

  componentDidMount = () => {
    this.handleSearch('');
  };

  handleSearch = (query) => {
    const { store, id } = this.props;

    this.setState({ isLoading: true });
    fetch(`${SEARCH_URI}/api/v0.1/countries/cities`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ country: query })
    })
      .then((resp) => resp.json())
      .then((items) => {
        const options = items.list.map((i) => ({
          id: i.id,
          name: i.name
        }));

        this.setState({
          options,
          isLoading: false
        });
      });
  };

  render() {
    const { options, isLoading, placeholde } = this.state;
    const { store, id, placeholder } = this.props;

    return (
      <AsyncTypeahead
        {...this.state}
        isLoading={isLoading}
        labelKey={(option) => `${option.name}`}
        id={id}
        minLength={0}
        selected={store.regional[id]}
        onChange={(selected) => {
          store.postRegional({
            field: id,
            value: selected
          });
          this.setState({ selected });
        }}
        multiple
        onSearch={this.handleSearch}
        placeholder={placeholder || placeholde}
        renderMenuItemChildren={(option, props) => (
          <Fragment>
            <span>{option.name}</span>
          </Fragment>
        )}
      />
    );
  }
}

export default MultipleCity;

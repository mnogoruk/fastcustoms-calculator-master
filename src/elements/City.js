import React from 'react';
import '../css/calculate.css';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { observer, inject } from 'mobx-react';
import { SEARCH_URI } from '@/constants';

@inject('store')
@observer
class MagicCity extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      options: [],
      selected: [],
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
    let cid =
      id === 'fromCity'
        ? store.calculate.fromCountry.id
        : store.calculate.toCountry.id;

    this.setState({ isLoading: true });
    fetch(`${SEARCH_URI}/api/v0.1/countries/cities`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ country: cid })
    })
      .then((resp) => resp.json())
      .then((items) => {
        let datar = items.data.reduce(function (a, b) {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, []);

        const options = datar.map((row) => ({
          id: row,
          name: row
        }));

        this.setState({
          options,
          isLoading: false
        });
      });
  };

  render() {
    const { options, isLoading } = this.state;
    const { store, id, placeholder } = this.props;

    return (
      <AsyncTypeahead
        {...this.state}
        isLoading={isLoading}
        labelKey={(option) => `${option.name}`}
        id={id}
        minLength={0}
        onChange={(selected) => {
          store.postCalculate({
            field: id,
            value: selected
          });
          this.setState({ selected });
        }}
        onSearch={this.handleSearch}
        placeholder={placeholder}
        renderMenuItemChildren={(option, props) => (
          <React.Fragment>
            <span>{option.name}</span>
          </React.Fragment>
        )}
      />
    );
  }
}

export default MagicCity;

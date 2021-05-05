import { observable, action, computed, toJS } from 'mobx';

class Store {
  @observable currency = 'EUR';
  @observable pageIndex= 'calculate';
  @observable modal = {
    id: 0
  };
  @observable searchId = 0;

  @observable ranges = {
    kg: [
      { id: 600, price: 0.000175 },
      { id: 1200, price: 0.00017 },
      { id: 3000, price: 0.000168 }
    ],
    m: [
      { id: 3, price: 0.000175 },
      { id: 7.2, price: 0.00017 },
      { id: 30, price: 0.000168 }
    ],
    ldm: [
      { id: 1, price: 0.000175 },
      { id: 2.5, price: 0.00017 },
      { id: 5, price: 0.000168 }
    ]
  };

  @observable form = {};
  @observable calculate= {
    fromCountry: { id: '', name: '' },
    toCountry: { id: '', name: '' },
    fromCity: { id: '', name: '' },
    toCity: { id: '', name: '' }
  };
  @observable total= {};
  @observable options = {};
  @observable regional= {
    europe: [],
    asia: [],
    usa: [],
    russia: []
  };

  @action modalToggle(show){
    this.modal = show;
  }

  @action postCalculate(data){
    if (data.value[0]) {
      this.calculate[data.field] = data.value[0];
    } else {
      this.calculate[data.field] = {};
    }
  }

  @action postOrderForm(data){
    this.form[data.field] = data.value || '';
  }

  @action searchForm(data) {
    this.calculate = data.calculate;
    this.total = data.total;
    this.options = data.options;
  }

  @action postRegional(data){
    if (data.value) {
      this.regional[data.field] = data.value;
    } else {
      this.regional[data.field] = {};
    }
  }

  @action generateRoute(route) {
    this.initial = route.initial;
    this.searchId = route.searchId || 0;
  }

  @action setCurrency(currency) {
    this.currency = currency;
  }

  @action changePageIndex(pageIndex) {
    this.pageIndex = pageIndex;
  }

  @computed get commentsCount() {
    return this.comments.length;
  }

  @computed get calculateReceive() {
    return {
      calculate: toJS(this.calculate),
      options: toJS(this.options)
    };
  }
}

export default new Store();

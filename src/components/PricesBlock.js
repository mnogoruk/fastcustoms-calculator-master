import {inject, observer} from "mobx-react";
import React, {Component} from "react";

@inject('store')
@observer
export class PricesBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    deleteInterval = (id) => {
        const {store, block} = this.props;
        const {ranges} = store;

        let items = ranges[block];
        items.splice(
            items.findIndex((item) => item.id === id),
            1
        );
    };

    addInterval = () => {
        const {store, block} = this.props;
        const {ranges} = store;

        let items = ranges[block];
        items.push({
            id: parseInt(items[items.length - 1].id) + 1,
            price: items[items.length - 1].price
        });
    };

    handleInput = (e, context) => {
        const {store, block} = this.props;
        const {ranges} = store;

        let items = ranges[block];
        const index = e.target.name.replace(`${context}_${block}_`, '');

        if (context === 'from' || context === 'to') {
            items[index].id = e.target.value || '';
        } else {
            items[index].price = e.target.value || '';
        }
    };

    sectionHeading = (section) => {
        switch (section) {
            case 'kg':
                return {title: 'общий вес', metric: 'КГ'};
            case 'm':
                return {
                    title: 'объём груза',
                    metric: (
                        <span>
              М<sup>3</sup>
            </span>
                    )
                };
            case 'ldm':
                return {title: 'погрузочный метр', metric: 'LDM'};
        }
    };

    render() {
        const {store, block, parent} = this.props;
        const {ranges} = store;
        let items = ranges[block];
        const section = this.sectionHeading(block);

        return (
            <React.Fragment>
                <h2>Цена за {section.title}</h2>

                <div className="row pt-3">
                    <div className="col-md-12">
                        {items.map((range, i) => {
                            return (
                                <React.Fragment>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label>
                                                от{' '}
                                                <input
                                                    type="text"
                                                    className=""
                                                    name={`from_${block}_${i}`}
                                                    onChange={(e) => this.handleInput(e, `from`)}
                                                    style={{
                                                        width: 150,
                                                        display: 'inline-block',
                                                        textAlign: 'center',
                                                        cursor: 'no-drop'
                                                    }}
                                                    value={i === 0 ? 0 : items[i - 1].id}
                                                    disabled
                                                />{' '}
                                                до{' '}
                                                <input
                                                    type="text"
                                                    className=""
                                                    name={`to_${block}_${i}`}
                                                    onChange={(e) => this.handleInput(e, `to`)}
                                                    style={{
                                                        width: 150,
                                                        display: 'inline-block',
                                                        textAlign: 'center'
                                                    }}
                                                    value={items[i].id}
                                                />{' '}
                                                {section.metric}{' '}
                                            </label>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="input-group input-group-lg">
                                                <label>
                                                    {' '}
                                                    <input
                                                        type="text"
                                                        className=""
                                                        name={`price_${block}_${i}`}
                                                        onChange={(e) => this.handleInput(e, `price`)}
                                                        value={items[i].price}
                                                        style={{
                                                            width: 150,
                                                            display: 'inline-block',
                                                            textAlign: 'center'
                                                        }}
                                                    />{' '}
                                                    €
                                                </label>
                                                &nbsp;
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            {i > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => this.deleteInterval(range.id)}
                                                    className="btn btn-danger btn-lg"
                                                >
                                                    Удалить
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                        <div className="col-md-6 text-right">
                            <button
                                type="button"
                                onClick={() => this.addInterval()}
                                className="btn btn-primary btn-lg"
                            >
                                Добавить промежуток
                            </button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
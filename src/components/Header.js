import React from 'react';
import Logo from '../images/logo.png';
import mainBg from '../images/main_bg.jpg';

export default class Header extends React.Component {
  render() {
    return (
      <React.Fragment>
        <header
          className="header"
          style={{ backgroundImage: `url(${mainBg})` }}
        >
          <div className="container">
            <div className="header__top">
              <div className="header__top__logo">
                <img src={Logo} alt="logo" className="logo" />
                <div className="logo-descr">
                  <p className="name">
                    <span>Format</span>Logistic
                  </p>
                  <p>Перевозки грузов в Россию</p>
                </div>
              </div>
              <div className="header__top__backcall">
                <a href="tel:+74992816081" className="phone-link">
                  +7 (499) 281-60-81
                </a>
                <a href="#backcall_modal" className="modal-win header-btn">
                  Заказать обратный звонок
                </a>
              </div>
            </div>
            <div className="header__content">
              <div className="header__content__left-side">
                <h1 className="main-title">
                  <span>Доставка грузов</span> от 30 кг <br /> из любой точки
                  Европы, США <br /> и Дальнего востока{' '}
                </h1>
                <h2 className="main-subtitle">
                  на ваш склад в России по цене на 20% ниже рыночной
                </h2>
                <p className="main-descr">
                  Доставка товара из Европы - от 5 дней, <br /> из Азии и
                  Америки – от 10 дней
                </p>
                <div className="main-btn-block">
                  <p>Рассчитайте стоимость доставки груза на ваш склад</p>
                  <a href="#step_modal" className="modal-win btn-style main-btn">
                    Узнать стоимость
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>
      </React.Fragment>
    );
  }
}

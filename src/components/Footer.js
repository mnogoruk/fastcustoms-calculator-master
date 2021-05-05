import React from 'react';
import Logo from '../images/logo.png';
import history from '../history';

export default class Footer extends React.Component {
  render() {
    return (
      <React.Fragment>
        <footer className="footer">
          <div className="container">
            <div className="footer__content">
              <div className="footer__content__logo">
                <img src={Logo} alt="logo" className="logo" />
                <div className="logo-descr">
                  <p className="name">
                    <span>Format</span> Logistic
                  </p>
                  <p>Перевозки грузов в Россию</p>
                </div>
              </div>

              <div className="footer__content__social">
                <a
                  href="https://www.instagram.com/fastcustoms_/"
                  className="social-link"
                  target="_blank"
                >
                  <i className="icon icon-s-inst-icon"/>
                </a>
                <a
                  href="https://vk.com/fastcustoms"
                  className="social-link"
                  target="_blank"
                >
                  <i className="icon icon-s-vk-icon"/>
                </a>
              </div>
              <div className="footer__content__backcall">
                <a href="tel:+74992816081" className="phone-link">
                  +7 (499) 281-60-81
                </a>
                <a
                  href="/"
                  onClick={(e) => {
                    history.push('/admin');
                    e.preventDefault();
                  }}
                  className="footer-btn modal-win"
                >
                  Администрирование
                </a>
              </div>
            </div>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

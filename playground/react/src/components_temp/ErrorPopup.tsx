import React from 'react';

const ErrorPopup = () => (
  <div className='cb-error-popup'>
    <div className='cb-error-popup-icon'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='35'
        height='29'
        viewBox='0 0 35 29'
      >
        <path
          d='M0 29L17.5 0L35 29H0ZM5.48864 25.9474H29.5114L17.5 6.10526L5.48864 25.9474ZM17.5 24.4211C17.9508 24.4211 18.3286 24.2748 18.6335 23.9822C18.9384 23.6897 19.0909 23.3272 19.0909 22.8947C19.0909 22.4623 18.9384 22.0998 18.6335 21.8072C18.3286 21.5147 17.9508 21.3684 17.5 21.3684C17.0492 21.3684 16.6714 21.5147 16.3665 21.8072C16.0616 22.0998 15.9091 22.4623 15.9091 22.8947C15.9091 23.3272 16.0616 23.6897 16.3665 23.9822C16.6714 24.2748 17.0492 24.4211 17.5 24.4211ZM15.9091 19.8421H19.0909V12.2105H15.9091V19.8421Z'
          fill='#C11111'
        />
      </svg>
    </div>
    <div>
      <p className='cb-error-popup-text'>
        Unable to complete action at this time. If the problem persists please contact support.
      </p>
    </div>
  </div>
);

export default ErrorPopup;

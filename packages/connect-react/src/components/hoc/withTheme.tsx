import React from 'react';

const withTheme = (Component: React.ComponentType<any>) => {
  const HOC = (props: any) => {
    return (
      <div className='light'>
        <Component {...props} />
      </div>
    );
  };

  return HOC;
};

export default withTheme;

import type { CorbadoProviderProps } from '@corbado/react';
import { CorbadoAuth, CorbadoProvider } from '@corbado/react';
import type { CorbadoAuthConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';

export class Corbado {
  #corbadoProps: CorbadoProviderProps | null = null;

  load(options: CorbadoProviderProps) {
    this.#corbadoProps = options;
  }

  mountAuthUI(element: HTMLElement, options: CorbadoAuthConfig) {
    if (!this.#corbadoProps) {
      throw new Error('Corbado is not loaded');
    }

    const AuthUI: FC<{ ProviderProps: CorbadoProviderProps; AuthProps: CorbadoAuthConfig }> = ({
      ProviderProps,
      AuthProps,
    }) => {
      // const [count, setCount] = React.useState(0);
      return (
        <CorbadoProvider {...ProviderProps}>
          <CorbadoAuth {...AuthProps} />
        </CorbadoProvider>
      );
      // console.log(ProviderProps, AuthProps);

      // return (
      //   <div>
      //     <h1>Corbado Test Application</h1>
      //     <p>Count: {count}</p>
      //     <button onClick={() => setCount(count + 1)}>Add</button>
      //   </div>
      // );
    };

    ReactDOM.render(
      <AuthUI
        ProviderProps={this.#corbadoProps}
        AuthProps={options}
      />,
      element,
    );

    // ReactDOM.render(<div {...options}>This is working?</div>, element);
  }
}

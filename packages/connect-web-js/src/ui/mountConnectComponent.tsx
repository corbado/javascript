import type { FC } from 'react';
import React from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mountComponent<T extends Record<string, any>>(
  element: HTMLElement,
  Component: FC<T>,
  componentOptions: T,
) {
  const ComponentWithContext: FC<{ componentProps: T }> = ({ componentProps }) => {
    return <Component {...componentProps} />;
  };

  const root = createRoot(element);
  root.render(<ComponentWithContext componentProps={componentOptions} />);

  return root;
}

export function unmountComponent(root: Root) {
  root.unmount();
}

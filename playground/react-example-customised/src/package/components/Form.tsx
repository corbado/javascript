import { FC, FormEventHandler } from 'react';
import { CustomizableComponent } from '../types/common';
import { Button } from './Button';

export interface FormProps extends CustomizableComponent {
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const Form: FC<FormProps> = ({ children, onSubmit }) => {
  return (
    <form
      className='cb-form'
      onSubmit={onSubmit}
    >
      <div className='cb-form-body'>{children}</div>
      <Button
        variant='primary'
        className='cb-form-button'
      >
        Continue with email
      </Button>
    </form>
  );
};

export default Form;

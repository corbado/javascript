import { FC, FormEventHandler, ReactNode } from 'react';
import { CustomizableComponent } from '../types/common';
import { Button } from './Button';

export interface FormProps extends CustomizableComponent {
  onSubmit: FormEventHandler<HTMLFormElement>;
  submitButtonText: ReactNode;
}

export const Form: FC<FormProps> = ({ children, onSubmit, submitButtonText }) => {
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
        {submitButtonText}
      </Button>
    </form>
  );
};

export default Form;

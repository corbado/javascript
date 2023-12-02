import { AnchorHTMLAttributes, FunctionComponent, SVGProps } from 'react';

interface AdditionalProps {
  Icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  label: string;
}

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & AdditionalProps;

export const IconLink: FunctionComponent<Props> = ({ target = '_blank', className, Icon, label, ...rest }) => {
  return (
    <a
      target={target}
      className={`cb-link-icon ${className}`}
      {...rest}
    >
      <Icon className='cb-icon' /> <p className={``}>{label}</p>
    </a>
  );
};

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
      className={` ${className}`}
      {...rest}
    >
      <Icon /> <p className={`cb-body font-bold pl-2 text-center`}>{label}</p>
    </a>
  );
};

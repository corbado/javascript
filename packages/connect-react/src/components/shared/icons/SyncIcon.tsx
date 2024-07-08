import type { InputHTMLAttributes } from 'react';
import React from 'react';

export const KeyIcon = ({ className }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <svg
      viewBox='0 0 8 8'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M7.5 1.02132V2.80855C7.5 2.8678 7.47646 2.92463 7.43457 2.96652C7.39267 3.00842 7.33585 3.03196 7.2766 3.03196H5.48936C5.43011 3.03196 5.37329 3.00842 5.33139 2.96652C5.28949 2.92463 5.26596 2.8678 5.26596 2.80855C5.26596 2.7493 5.28949 2.69248 5.33139 2.65058C5.37329 2.60869 5.43011 2.58515 5.48936 2.58515H6.73745L6.06537 1.91494C5.49795 1.34502 4.72752 1.02361 3.9233 1.02132H3.90617C3.10886 1.0188 2.34259 1.33018 1.77303 1.88813C1.7523 1.90976 1.72744 1.92701 1.69991 1.93884C1.67238 1.95067 1.64275 1.95684 1.61279 1.95699C1.58282 1.95713 1.55314 1.95125 1.5255 1.93968C1.49785 1.92812 1.47282 1.91112 1.45188 1.88968C1.43095 1.86825 1.41454 1.84282 1.40363 1.81491C1.39272 1.787 1.38754 1.75719 1.38839 1.72724C1.38924 1.69728 1.39611 1.66781 1.40859 1.64057C1.42106 1.61333 1.43889 1.58887 1.46101 1.56866C2.11334 0.927937 2.99181 0.569968 3.90617 0.572277H3.92553C4.84819 0.574628 5.73213 0.943341 6.38298 1.59733L7.05319 2.26754V1.02132C7.05319 0.962069 7.07673 0.905245 7.11862 0.863349C7.16052 0.821452 7.21735 0.797915 7.2766 0.797915C7.33585 0.797915 7.39267 0.821452 7.43457 0.863349C7.47646 0.905245 7.5 0.962069 7.5 1.02132ZM6.22697 6.11196C5.65777 6.67072 4.89146 6.98292 4.09383 6.981H4.0767C3.27248 6.9787 2.50205 6.6573 1.93463 6.08738L1.26255 5.41494H2.51064C2.56989 5.41494 2.62671 5.3914 2.66861 5.3495C2.71051 5.30761 2.73404 5.25078 2.73404 5.19153C2.73404 5.13228 2.71051 5.07546 2.66861 5.03356C2.62671 4.99166 2.56989 4.96813 2.51064 4.96813H0.723404C0.664154 4.96813 0.60733 4.99166 0.565434 5.03356C0.523537 5.07546 0.5 5.13228 0.5 5.19153V6.97877C0.5 7.03802 0.523537 7.09484 0.565434 7.13674C0.60733 7.17863 0.664154 7.20217 0.723404 7.20217C0.782655 7.20217 0.839478 7.17863 0.881375 7.13674C0.923271 7.09484 0.946809 7.03802 0.946809 6.97877V5.73068L1.61702 6.40275C2.26787 7.05674 3.15181 7.42546 4.07447 7.42781H4.09383C5.00819 7.43012 5.88666 7.07215 6.53899 6.43143C6.56111 6.41121 6.57894 6.38676 6.59141 6.35952C6.60389 6.33227 6.61076 6.3028 6.61161 6.27285C6.61246 6.2429 6.60728 6.21308 6.59637 6.18517C6.58546 6.15727 6.56905 6.13184 6.54811 6.1104C6.52718 6.08897 6.50215 6.07196 6.4745 6.0604C6.44686 6.04884 6.41718 6.04295 6.38721 6.0431C6.35725 6.04324 6.32762 6.04942 6.30009 6.06124C6.27256 6.07307 6.2477 6.09032 6.22697 6.11196Z'
        fill='currentColor'
      />
    </svg>
  );
};
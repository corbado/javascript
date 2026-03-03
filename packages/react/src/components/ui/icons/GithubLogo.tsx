import type { FC } from 'react';
import React from 'react';

import useTheme from '../../../hooks/useTheme';
import githubSrc from '../../../shared-ui/assets/github.svg';
import githubDarkSrc from '../../../shared-ui/assets/github-dark.svg';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const GithubIcon: FC<IconProps> = props => {
  const { darkMode } = useTheme();
  return (
    <Icon
      src={darkMode ? githubDarkSrc : githubSrc}
      {...props}
    />
  );
};

export default GithubIcon;

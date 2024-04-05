import githubSrc from '@corbado/shared-ui/assets/github.svg';
import githubDarkSrc from '@corbado/shared-ui/assets/github_dark.svg';
import type { FC } from 'react';
import React from 'react';

import useTheme from '../../../hooks/useTheme';
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

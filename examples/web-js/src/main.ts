import Corbado from '@corbado/web-js';
import Prism from 'prismjs';
import { insertHeader } from './scripts/header';

import 'prismjs/themes/prism-tomorrow.min.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import { insertGuide } from './scripts/guide';
import { insertDemo } from './scripts/demo';

await Corbado.load({
  projectId: import.meta.env.VITE_CORBADO_PROJECT_ID,
});

insertHeader(!!Corbado.isAuthenticated, Corbado.user);
insertGuide(!!Corbado.isAuthenticated);
insertDemo(Corbado);

Prism.highlightAll();

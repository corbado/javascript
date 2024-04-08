import Corbado from '@corbado/web-js';
import Prism from 'prismjs';
import { insertHeader } from './components/header';

import 'prismjs/themes/prism-tomorrow.min.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import { insertGuide } from './components/guide';
import { insertDemo } from './components/demo';

(async () => {
  await Corbado.load({
    projectId: import.meta.env.VITE_CORBADO_PROJECT_ID,
  });

  insertHeader(Corbado.isAuthenticated, Corbado.user);
  insertGuide(Corbado.isAuthenticated);
  insertDemo(Corbado);

  Prism.highlightAll();
})();

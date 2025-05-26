import Corbado from '@corbado/web-js';
import Prism from 'prismjs';
import { insertHeader } from './components/header';

import { sendEvent, TelemetryEventType } from '@corbado/shared-util';

import 'prismjs/themes/prism-tomorrow.min.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import { insertGuide } from './components/guide';
import { insertDemo } from './components/demo';

(async () => {
  await Corbado.load({
    projectId: import.meta.env.VITE_CORBADO_PROJECT_ID,
  });

  void sendEvent({
    type: TelemetryEventType.EXAMPLE_APPLICATION_OPENED,
    payload: {
      exampleName: 'corbado/javascript/examples/web-js',
    },
    sdkVersion: '3.1.1',
    sdkName: 'React SDK',
    identifier: import.meta.env.VITE_CORBADO_PROJECT_ID,
  });

  insertHeader(Corbado.isAuthenticated, Corbado.user);
  insertGuide(Corbado.isAuthenticated);
  insertDemo(Corbado);

  Prism.highlightAll();
})();

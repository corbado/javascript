import Corbado from '@corbado/web-js';
import { insertDemoComponent } from './demoComponent';

const demoHtml = `
<div id="demo" class='flex gap-2 justify-items-center flex-col px-2'></div>
`;

export function insertDemo(initialCorbadoApp: typeof Corbado) {
  let corbadoApp = initialCorbadoApp;
  document.getElementById('right-section')!.innerHTML = demoHtml;

  insertDemoComponent(corbadoApp);
}

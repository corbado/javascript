import '../src/index.css';
import '../src/App.css';
import type { Metadata } from 'next';
import { PlaygroundProviders } from '../src/components/PlaygroundProviders';
import { TestSidebar } from '../src/tools/TestSidebar';

export const metadata: Metadata = {
  title: 'Corbado React Playground',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <PlaygroundProviders>
          <div className='playground-shell'>
            <main className='playground-main'>{children}</main>
            <TestSidebar />
          </div>
        </PlaygroundProviders>
      </body>
    </html>
  );
}

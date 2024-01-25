import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/themes/prism-tomorrow.min.css';
import { GuideHeader } from './GuideHeader';
import { CommonSteps } from './CommonSteps';
import { AuthBasedSteps } from './AuthBasedSteps';

export const Guide = () => {
  return (
    <>
      <GuideHeader />
      <ol>
        <CommonSteps />
        <AuthBasedSteps />
      </ol>
    </>
  );
};

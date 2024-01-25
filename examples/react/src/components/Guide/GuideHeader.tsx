import { useCorbado } from '@corbado/react';
import { passkeyGuideHeader, authGuideHeader, passkeyComponentBody, authComponentBody } from '../../utils/constants';

export const GuideHeader = () => {
  const { isAuthenticated } = useCorbado();
  return (
    <>
      <h2 className='heading mt-7'>{isAuthenticated ? passkeyGuideHeader : authGuideHeader}</h2>
      <p className='paragraph mb-3'>{isAuthenticated ? passkeyComponentBody : authComponentBody}</p>
    </>
  );
};

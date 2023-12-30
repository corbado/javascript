import { useCorbado } from '@corbado/react-sdk';
import FilledButton from '../buttons/FilledButton.tsx';

export const GlobalErrorScreen = () => {
  const { globalError } = useCorbado();

  if (!globalError) {
    return;
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-4xl text-red-600'>Integration error ({globalError.type} side)</h1>
      <table className='table-auto my-5'>
        <tr>
          <td className='w-1/4'>Message</td>
          <td>{globalError.message}</td>
        </tr>
        <tr>
          <td>Type</td>
          <td>{globalError.detailedType}</td>
        </tr>
        <tr>
          <td>Link</td>
          <td>{globalError.link}</td>
        </tr>
        {globalError.requestId && (
          <tr>
            <td>Request ID</td>
            <td>{globalError.requestId}</td>
          </tr>
        )}
      </table>
      {globalError.details && (
        <FilledButton
          content='See browser console for more details'
          onClick={() => {
            window.open(globalError?.details, '_blank', 'noreferrer');
          }}
        />
      )}
    </div>
  );
};

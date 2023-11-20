interface Props {
  content: string;
  onClick: () => void;
}

const FilledButton = ({ content, onClick }: Props) => {
  return (
    <button
      className='bg-blue-500 text-white font-bold py-2 px-4 rounded w-full'
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default FilledButton;

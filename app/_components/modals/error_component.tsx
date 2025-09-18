import React from 'react';

export default function ErrorMessage({ message }: { message: string }) {


  return (
    <div
      className="flex max-w-md w-[500px] h-[200px] p-5 border rounded-lg border-border-primary bg-bg-secondary relative text-center items-center justify-center text-text-primary"
    >
        {message}
    </div>
  );
}

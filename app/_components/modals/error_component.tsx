import React from 'react';

export default function ErrorMessage({ message }: { message: string }) {


  return (
    <div
      className="flex max-w-md w-[500px] h-[200px] p-5 border rounded-lg border-[var(--bg-300)] bg-[var(--bg-200)] relative text-center items-center justify-center text-[var(--text-100)]"
    >
        {message}
    </div>
  );
}

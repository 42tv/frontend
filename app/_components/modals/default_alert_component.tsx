import React from 'react';

export default function DefaultAlertMessage({ message }: { message: string }) {
  return (
    <div
      className="flex max-w-md p-5 border rounded-lg border-[var(--bg-300)] bg-[var(--bg-200)] relative text-center items-center justify-center text-[var(--text-100)]"
    >
        {message}
    </div>
  );
}

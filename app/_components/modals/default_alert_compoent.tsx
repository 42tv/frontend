import React from 'react';

export default function DefaultAlertMessage({ message }: { message: string }) {
  return (
    <div
      className="flex max-w-md w-[500px] h-[200px] p-5 border rounded-lg border-contentBg bg-contentBg relative text-center items-center justify-center" // Added text-left class for left alignment
    >
        {message}
    </div>
  );
}

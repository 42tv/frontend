import React from 'react';

export default function SendPostComponent({ message }: { message: string }) {


  return (
    <div
      className="flex max-w-md w-[450px] h-[500px] p-5 border rounded-lg border-contentBg bg-contentBg relative text-center items-center justify-center"
    >
        {message}
    </div>
  );
}

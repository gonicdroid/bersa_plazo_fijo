import React from 'react';

interface CardWithCodeProps {
  data: any;
}

export default function CardWithCode({ data }: CardWithCodeProps) {
  return (
    <div className="text-white mt-4 p-4 border rounded bg-gray-50 dark:bg-gray-800 overflow-auto">
      <pre className="text-sm">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
}

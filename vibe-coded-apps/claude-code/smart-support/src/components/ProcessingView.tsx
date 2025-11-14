import { Loader2 } from 'lucide-react';

interface ProcessingViewProps {
  message?: string;
}

export default function ProcessingView({ message = 'Processing your request...' }: ProcessingViewProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900">{message}</p>
        <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
      </div>
    </div>
  );
}

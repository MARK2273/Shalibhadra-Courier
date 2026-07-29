import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertTriangle, FileQuestion, Clock, Home } from 'lucide-react';

const DocumentErrorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  const getErrorDetails = () => {
    switch (type) {
      case 'invalid':
        return {
          title: 'Invalid Link',
          message: 'The document link you followed is invalid or incorrectly formatted. Please double-check the URL.',
          icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
        };
      case 'not-found':
        return {
          title: 'Document Not Found',
          message: 'The document you are looking for does not exist or has been removed from our system.',
          icon: <FileQuestion className="w-12 h-12 text-orange-500" />,
        };
      case 'pending':
        return {
          title: 'Document Pending',
          message: "The PDF for this shipment is still being processed or hasn't been uploaded yet. Please try again in a few minutes.",
          icon: <Clock className="w-12 h-12 text-blue-500" />,
        };
      default:
        return {
          title: 'Unexpected Error',
          message: 'An unexpected error occurred while trying to retrieve your document. Please contact support if the issue persists.',
          icon: <AlertTriangle className="w-12 h-12 text-gray-500" />,
        };
    }
  };

  const { title, message, icon } = getErrorDetails();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 font-sans transition-colors">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 max-w-md w-full text-center transition-colors">
        <div className="bg-slate-50 dark:bg-slate-700/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
          {icon}
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{title}</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
          {message}
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-blue-200"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
        
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Need help? Contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentErrorPage;

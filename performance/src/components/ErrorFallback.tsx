interface ErrorFallbackProps {
	error: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
	return (
		<div className='flex flex-col items-center justify-center h-screen p-10 text-white bg-slate-900'>
			<div className='text-center'>
				<h1 className='mb-4 text-4xl font-extrabold text-red-500'>Something went wrong!</h1>
				<p className='mb-2 text-lg'>An error occurred:</p>
				<pre className='p-4 mb-4 text-red-300 rounded-md bg-slate-800'>{error.message}</pre>
				<p className='text-sm'>Please try again later.</p>
			</div>
		</div>
	);
};

export default ErrorFallback;

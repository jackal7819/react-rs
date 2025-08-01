import { Link } from 'react-router';
export const AboutPage = () => {
  return (
    <div className="grid min-h-screen px-8 antialiased md:pb-20 bg-slate-200 dark:text-slate-400 dark:bg-slate-900 text-slate-700 place-items-center">
      <div className="max-w-4xl p-4 mx-auto">
        <h1 className="mb-6 text-4xl font-bold text-center">
          About Viktor Filippov
        </h1>
        <p className="mb-4 text-lg">
          Hello! I&apos;m a beginner frontend developer currently studying React
          on the RS School course. I love programming and enjoy learning new
          technologies to build awesome web applications.
        </p>
        <p className="mb-4 text-lg">
          This application was created as part of my learning journey. It uses
          the Rick and Morty API to display fun and interesting content.
        </p>
        <p className="mb-6 text-lg">
          To learn React and become a frontend developer, I recommend the{' '}
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 font-semibold duration-500 cursor-pointer hover:brightness-110 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-amber-600 after:duration-500 hover:after:w-full"
          >
            RS School React course
          </a>
          .
        </p>
        <nav className="text-center">
          <Link
            to="/"
            className="bg-amber-600 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center text-black hover:bg-amber-500 duration-500 cursor-pointer uppercase"
          >
            Back to Home
          </Link>
        </nav>
      </div>
    </div>
  );
};

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950 p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl xl:-top-6 opacity-30 pointer-events-none">
        <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>
      
      <main className="w-full max-w-3xl text-center space-y-10 z-10 px-4">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-medium mb-4 shadow-sm border border-blue-200 dark:border-blue-800/50">
            ✨ Your academic life, organized
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-7xl leading-tight">
            Study <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Planner</span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto leading-relaxed">
            Organize your tasks, assignments, and study schedule in one beautiful and simple place. Your academic success starts here.
          </p>
        </div>
        
        <div className="pt-6 flex justify-center gap-4 flex-col sm:flex-row items-center">
          <Link
            href="/tasks"
            className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold text-lg transition-all hover:scale-105 active:scale-95 hover:shadow-xl shadow-md w-full sm:w-auto"
          >
            Go to Tasks
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </main>
      
      <footer className="absolute bottom-8 text-sm text-zinc-500 dark:text-zinc-400 flex items-center justify-center w-full bg-white/50 dark:bg-black/50 backdrop-blur-sm py-2">
        Built for students, by students.
      </footer>
    </div>
  );
}

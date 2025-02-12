const DarkModeToggle = () => {
  // This code should be added to <head>.
  // It's used to prevent page load glitches.
  const html = document.querySelector('html');
  const isLightOrAuto = localStorage.getItem('hs_theme') === 'light' || (localStorage.getItem('hs_theme') === 'auto' && !window.matchMedia('(prefers-color-scheme: dark)').matches);
  const isDarkOrAuto = localStorage.getItem('hs_theme') === 'dark' || (localStorage.getItem('hs_theme') === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isLightOrAuto && html.classList.contains('dark')) html.classList.remove('dark');
  else if (isDarkOrAuto && html.classList.contains('light')) html.classList.remove('light');
  else if (isDarkOrAuto && !html.classList.contains('dark')) html.classList.add('dark');
  else if (isLightOrAuto && !html.classList.contains('light')) html.classList.add('light');

  return (
    <div className="hs-dropdown">
      <button id="hs-dropdown-dark-mode" type="button" className="hs-dropdown-toggle hs-dark-mode group flex items-center text-gray-600 hover:text-blue-600 focus:outline-none focus:text-blue-600 font-medium dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500 p-1.5 rounded-full hover:bg-gray-200" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
        <svg className="hs-dark-mode-active:hidden block size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
        <svg className="hs-dark-mode-active:block hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>
      </button>

      <div id="selectThemeDropdown" className="hs-dropdown-menu hs-dropdown-open:opacity-100 mt-2 hidden z-10 transition-[margin,opacity] opacity-0 duration-300 mb-2 origin-bottom-left bg-white shadow-md rounded-lg p-1 space-y-0.5 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-dark-mode">
        <button type="button" className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" data-hs-theme-click-value="default">
          Default (Light)
        </button>
        <button type="button" className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" data-hs-theme-click-value="dark">
          Dark
        </button>
        <button type="button" className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300" data-hs-theme-click-value="auto">
          Auto (System)
        </button>
      </div>
    </div>
  )
}

export default DarkModeToggle
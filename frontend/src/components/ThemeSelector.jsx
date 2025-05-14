import { Palette } from 'lucide-preact';
import { useEffect, useState } from 'preact/hooks';

const themes = [
  'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave',
  'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua',
  'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula',
  'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter',
  'dim', 'nord', 'sunset', 'caramellatte', 'abyss', 'silk'
];

const ThemeSelector = () => {
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('theme', selectedTheme);
  }, [selectedTheme]);

  return (
    <div className="dropdown dropdown-end">
      <button
        className="btn btn-ghost btn-circle"
        aria-label="Select theme"
      >
        <Palette />
      </button>
      <ul className="menu dropdown-content z-[1] p-2 shadow bg-base-100 text-base-content rounded-box w-128 max-h-64 overflow-y-auto">
        {themes.map(theme => (
          <li key={theme}>
            <button
              role="menuitem"
              className={`w-full text-left hover:bg-base-200 rounded ${selectedTheme === theme ? 'font-bold' : ''}`}
              onClick={() => setSelectedTheme(theme)}
            >
              {theme}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThemeSelector;

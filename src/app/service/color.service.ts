import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  colors = [
    {
      name: 'red',
      light: 'bg-red-300 hover:bg-red-400',
      dark: 'bg-red-600 hover:bg-red-500',
      lightFrom: 'from-red-300 hover:from-red-400',
      lightTo: 'to-red-300 hover:to-red-400', // Set to 300
      darkFrom: 'from-red-600 hover:from-red-500',
      darkTo: 'to-red-600 hover:to-red-500', // Set to 600
    },
    {
      name: 'orange',
      light: 'bg-orange-300 hover:bg-orange-400',
      dark: 'bg-orange-600 hover:bg-orange-500',
      lightFrom: 'from-orange-300 hover:from-orange-400',
      lightTo: 'to-orange-300 hover:to-orange-400', // Set to 300
      darkFrom: 'from-orange-600 hover:from-orange-500',
      darkTo: 'to-orange-600 hover:to-orange-500', // Set to 600
    },
    {
      name: 'amber',
      light: 'bg-amber-300 hover:bg-amber-400',
      dark: 'bg-amber-600 hover:bg-amber-500',
      lightFrom: 'from-amber-300 hover:from-amber-400',
      lightTo: 'to-amber-300 hover:to-amber-400', // Set to 300
      darkFrom: 'from-amber-600 hover:from-amber-500',
      darkTo: 'to-amber-600 hover:to-amber-500', // Set to 600
    },
    {
      name: 'yellow',
      light: 'bg-yellow-300 hover:bg-yellow-400',
      dark: 'bg-yellow-600 hover:bg-yellow-500',
      lightFrom: 'from-yellow-300 hover:from-yellow-400',
      lightTo: 'to-yellow-300 hover:to-yellow-400', // Set to 300
      darkFrom: 'from-yellow-600 hover:from-yellow-500',
      darkTo: 'to-yellow-600 hover:to-yellow-500', // Set to 600
    },
    {
      name: 'lime',
      light: 'bg-lime-300 hover:bg-lime-400',
      dark: 'bg-lime-600 hover:bg-lime-500',
      lightFrom: 'from-lime-300 hover:from-lime-400',
      lightTo: 'to-lime-300 hover:to-lime-400', // Set to 300
      darkFrom: 'from-lime-600 hover:from-lime-500',
      darkTo: 'to-lime-600 hover:to-lime-500', // Set to 600
    },
    {
      name: 'green',
      light: 'bg-green-300 hover:bg-green-400',
      dark: 'bg-green-600 hover:bg-green-500',
      lightFrom: 'from-green-300 hover:from-green-400',
      lightTo: 'to-green-300 hover:to-green-400', // Set to 300
      darkFrom: 'from-green-600 hover:from-green-500',
      darkTo: 'to-green-600 hover:to-green-500', // Set to 600
    },
    {
      name: 'emerald',
      light: 'bg-emerald-300 hover:bg-emerald-400',
      dark: 'bg-emerald-600 hover:bg-emerald-500',
      lightFrom: 'from-emerald-300 hover:from-emerald-400',
      lightTo: 'to-emerald-300 hover:to-emerald-400', // Set to 300
      darkFrom: 'from-emerald-600 hover:from-emerald-500',
      darkTo: 'to-emerald-600 hover:to-emerald-500', // Set to 600
    },
    {
      name: 'teal',
      light: 'bg-teal-300 hover:bg-teal-400',
      dark: 'bg-teal-600 hover:bg-teal-500',
      lightFrom: 'from-teal-300 hover:from-teal-400',
      lightTo: 'to-teal-300 hover:to-teal-400', // Set to 300
      darkFrom: 'from-teal-600 hover:from-teal-500',
      darkTo: 'to-teal-600 hover:to-teal-500', // Set to 600
    },
    {
      name: 'cyan',
      light: 'bg-cyan-300 hover:bg-cyan-400',
      dark: 'bg-cyan-600 hover:bg-cyan-500',
      lightFrom: 'from-cyan-300 hover:from-cyan-400',
      lightTo: 'to-cyan-300 hover:to-cyan-400', // Set to 300
      darkFrom: 'from-cyan-600 hover:from-cyan-500',
      darkTo: 'to-cyan-600 hover:to-cyan-500', // Set to 600
    },
    {
      name: 'sky',
      light: 'bg-sky-300 hover:bg-sky-400',
      dark: 'bg-sky-600 hover:bg-sky-500',
      lightFrom: 'from-sky-300 hover:from-sky-400',
      lightTo: 'to-sky-300 hover:to-sky-400', // Set to 300
      darkFrom: 'from-sky-600 hover:from-sky-500',
      darkTo: 'to-sky-600 hover:to-sky-500', // Set to 600
    },
    {
      name: 'blue',
      light: 'bg-blue-300 hover:bg-blue-400',
      dark: 'bg-blue-600 hover:bg-blue-500',
      lightFrom: 'from-blue-300 hover:from-blue-400',
      lightTo: 'to-blue-300 hover:to-blue-400', // Set to 300
      darkFrom: 'from-blue-600 hover:from-blue-500',
      darkTo: 'to-blue-600 hover:to-blue-500', // Set to 600
    },
    {
      name: 'indigo',
      light: 'bg-indigo-300 hover:bg-indigo-400',
      dark: 'bg-indigo-600 hover:bg-indigo-500',
      lightFrom: 'from-indigo-300 hover:from-indigo-400',
      lightTo: 'to-indigo-300 hover:to-indigo-400', // Set to 300
      darkFrom: 'from-indigo-600 hover:from-indigo-500',
      darkTo: 'to-indigo-600 hover:to-indigo-500', // Set to 600
    },
    {
      name: 'violet',
      light: 'bg-violet-300 hover:bg-violet-400',
      dark: 'bg-violet-600 hover:bg-violet-500',
      lightFrom: 'from-violet-300 hover:from-violet-400',
      lightTo: 'to-violet-300 hover:to-violet-400', // Set to 300
      darkFrom: 'from-violet-600 hover:from-violet-500',
      darkTo: 'to-violet-600 hover:to-violet-500', // Set to 600
    },
    {
      name: 'purple',
      light: 'bg-purple-300 hover:bg-purple-400',
      dark: 'bg-purple-600 hover:bg-purple-500',
      lightFrom: 'from-purple-300 hover:from-purple-400',
      lightTo: 'to-purple-300 hover:to-purple-400', // Set to 300
      darkFrom: 'from-purple-600 hover:from-purple-500',
      darkTo: 'to-purple-600 hover:to-purple-500', // Set to 600
    },
    {
      name: 'fuchsia',
      light: 'bg-fuchsia-300 hover:bg-fuchsia-400',
      dark: 'bg-fuchsia-600 hover:bg-fuchsia-500',
      lightFrom: 'from-fuchsia-300 hover:from-fuchsia-400',
      lightTo: 'to-fuchsia-300 hover:to-fuchsia-400', // Set to 300
      darkFrom: 'from-fuchsia-600 hover:from-fuchsia-500',
      darkTo: 'to-fuchsia-600 hover:to-fuchsia-500', // Set to 600
    },
    {
      name: 'pink',
      light: 'bg-pink-300 hover:bg-pink-400',
      dark: 'bg-pink-600 hover:bg-pink-500',
      lightFrom: 'from-pink-300 hover:from-pink-400',
      lightTo: 'to-pink-300 hover:to-pink-400', // Set to 300
      darkFrom: 'from-pink-600 hover:from-pink-500',
      darkTo: 'to-pink-600 hover:to-pink-500', // Set to 600
    },
    {
      name: 'rose',
      light: 'bg-rose-300 hover:bg-rose-400',
      dark: 'bg-rose-600 hover:bg-rose-500',
      lightFrom: 'from-rose-300 hover:from-rose-400',
      lightTo: 'to-rose-300 hover:to-rose-400', // Set to 300
      darkFrom: 'from-rose-600 hover:from-rose-500',
      darkTo: 'to-rose-600 hover:to-rose-500', // Set to 600
    },
  ];

  constructor() {}

  getColor(colorName: string, type: string) {
    let color = this.colors.find((color) => color.name === colorName);
    if (type === 'light') {
      return color?.light;
    } else if (type === 'dark') {
      return color?.dark;
    } else if (type === 'lightFrom') {
      return color?.lightFrom;
    } else if (type === 'lightTo') {
      return color?.lightTo;
    } else if (type === 'darkFrom') {
      return color?.darkFrom;
    } else {
      return color?.darkTo;
    }
  }
}

export const colorToHex = {
  'bg-red-300': '#fca5a5',
  'bg-red-400': '#f87171',
  'bg-red-500': '#ef4444',
  'bg-red-600': '#dc2626',

  // Orange
  'bg-orange-300': '#fdba74',
  'bg-orange-400': '#fb923c',
  'bg-orange-500': '#f97316',
  'bg-orange-600': '#ea580c',

  // Amber
  'bg-amber-300': '#fcd34d',
  'bg-amber-400': '#fbbf24',
  'bg-amber-500': '#f59e0b',
  'bg-amber-600': '#d97706',

  // Yellow
  'bg-yellow-300': '#fde047',
  'bg-yellow-400': '#facc15',
  'bg-yellow-500': '#eab308',
  'bg-yellow-600': '#ca8a04',

  // Lime
  'bg-lime-300': '#bef264',
  'bg-lime-400': '#a3e635',
  'bg-lime-500': '#84cc16',
  'bg-lime-600': '#65a30d',

  // Green
  'bg-green-300': '#86efac',
  'bg-green-400': '#4ade80',
  'bg-green-500': '#22c55e',
  'bg-green-600': '#16a34a',

  // Emerald
  'bg-emerald-300': '#6ee7b7',
  'bg-emerald-400': '#34d399',
  'bg-emerald-500': '#10b981',
  'bg-emerald-600': '#059669',

  // Teal
  'bg-teal-300': '#5eead4',
  'bg-teal-400': '#2dd4bf',
  'bg-teal-500': '#14b8a6',
  'bg-teal-600': '#0d9488',

  // Cyan
  'bg-cyan-300': '#67e8f9',
  'bg-cyan-400': '#22d3ee',
  'bg-cyan-500': '#06b6d4',
  'bg-cyan-600': '#0891b2',

  // Sky
  'bg-sky-300': '#7dd3fc',
  'bg-sky-400': '#38bdf8',
  'bg-sky-500': '#0ea5e9',
  'bg-sky-600': '#0284c7',

  // Blue
  'bg-blue-300': '#93c5fd',
  'bg-blue-400': '#60a5fa',
  'bg-blue-500': '#3b82f6',
  'bg-blue-600': '#2563eb',

  // Indigo
  'bg-indigo-300': '#a5b4fc',
  'bg-indigo-400': '#818cf8',
  'bg-indigo-500': '#6366f1',
  'bg-indigo-600': '#4f46e5',

  // Violet
  'bg-violet-300': '#c4b5fd',
  'bg-violet-400': '#a78bfa',
  'bg-violet-500': '#8b5cf6',
  'bg-violet-600': '#7c3aed',

  // Purple
  'bg-purple-300': '#d8b4fe',
  'bg-purple-400': '#c084fc',
  'bg-purple-500': '#a855f7',
  'bg-purple-600': '#9333ea',

  // Fuchsia
  'bg-fuchsia-300': '#f0abfc',
  'bg-fuchsia-400': '#e879f9',
  'bg-fuchsia-500': '#d946ef',
  'bg-fuchsia-600': '#c026d3',

  // Pink
  'bg-pink-300': '#f9a8d4',
  'bg-pink-400': '#f472b6',
  'bg-pink-500': '#ec4899',
  'bg-pink-600': '#db2777',

  // Rose
  'bg-rose-300': '#fda4af',
  'bg-rose-400': '#fb7185',
  'bg-rose-500': '#f43f5e',
  'bg-rose-600': '#e11d48',
};

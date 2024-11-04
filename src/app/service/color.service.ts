import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  colors = [
    {
      name: 'red',
      light: 'bg-red-300',
      dark: 'bg-red-600',
      lightFrom: 'from-red-300 hover:from-red-400',
      lightTo: 'to-red-300 hover:to-red-400', // Set to 300
      darkFrom: 'from-red-600 hover:from-red-500',
      darkTo: 'to-red-600 hover:to-red-500', // Set to 600
    },
    {
      name: 'orange',
      light: 'bg-orange-300',
      dark: 'bg-orange-600',
      lightFrom: 'from-orange-300 hover:from-orange-400',
      lightTo: 'to-orange-300 hover:to-orange-400', // Set to 300
      darkFrom: 'from-orange-600 hover:from-orange-500',
      darkTo: 'to-orange-600 hover:to-orange-500', // Set to 600
    },
    {
      name: 'amber',
      light: 'bg-amber-300',
      dark: 'bg-amber-600',
      lightFrom: 'from-amber-300 hover:from-amber-400',
      lightTo: 'to-amber-300 hover:to-amber-400', // Set to 300
      darkFrom: 'from-amber-600 hover:from-amber-500',
      darkTo: 'to-amber-600 hover:to-amber-500', // Set to 600
    },
    {
      name: 'yellow',
      light: 'bg-yellow-300',
      dark: 'bg-yellow-600',
      lightFrom: 'from-yellow-300 hover:from-yellow-400',
      lightTo: 'to-yellow-300 hover:to-yellow-400', // Set to 300
      darkFrom: 'from-yellow-600 hover:from-yellow-500',
      darkTo: 'to-yellow-600 hover:to-yellow-500', // Set to 600
    },
    {
      name: 'lime',
      light: 'bg-lime-300',
      dark: 'bg-lime-600',
      lightFrom: 'from-lime-300 hover:from-lime-400',
      lightTo: 'to-lime-300 hover:to-lime-400', // Set to 300
      darkFrom: 'from-lime-600 hover:from-lime-500',
      darkTo: 'to-lime-600 hover:to-lime-500', // Set to 600
    },
    {
      name: 'green',
      light: 'bg-green-300',
      dark: 'bg-green-600',
      lightFrom: 'from-green-300 hover:from-green-400',
      lightTo: 'to-green-300 hover:to-green-400', // Set to 300
      darkFrom: 'from-green-600 hover:from-green-500',
      darkTo: 'to-green-600 hover:to-green-500', // Set to 600
    },
    {
      name: 'emerald',
      light: 'bg-emerald-300',
      dark: 'bg-emerald-600',
      lightFrom: 'from-emerald-300 hover:from-emerald-400',
      lightTo: 'to-emerald-300 hover:to-emerald-400', // Set to 300
      darkFrom: 'from-emerald-600 hover:from-emerald-500',
      darkTo: 'to-emerald-600 hover:to-emerald-500', // Set to 600
    },
    {
      name: 'teal',
      light: 'bg-teal-300',
      dark: 'bg-teal-600',
      lightFrom: 'from-teal-300 hover:from-teal-400',
      lightTo: 'to-teal-300 hover:to-teal-400', // Set to 300
      darkFrom: 'from-teal-600 hover:from-teal-500',
      darkTo: 'to-teal-600 hover:to-teal-500', // Set to 600
    },
    {
      name: 'cyan',
      light: 'bg-cyan-300',
      dark: 'bg-cyan-600',
      lightFrom: 'from-cyan-300 hover:from-cyan-400',
      lightTo: 'to-cyan-300 hover:to-cyan-400', // Set to 300
      darkFrom: 'from-cyan-600 hover:from-cyan-500',
      darkTo: 'to-cyan-600 hover:to-cyan-500', // Set to 600
    },
    {
      name: 'sky',
      light: 'bg-sky-300',
      dark: 'bg-sky-600',
      lightFrom: 'from-sky-300 hover:from-sky-400',
      lightTo: 'to-sky-300 hover:to-sky-400', // Set to 300
      darkFrom: 'from-sky-600 hover:from-sky-500',
      darkTo: 'to-sky-600 hover:to-sky-500', // Set to 600
    },
    {
      name: 'blue',
      light: 'bg-blue-300',
      dark: 'bg-blue-600',
      lightFrom: 'from-blue-300 hover:from-blue-400',
      lightTo: 'to-blue-300 hover:to-blue-400', // Set to 300
      darkFrom: 'from-blue-600 hover:from-blue-500',
      darkTo: 'to-blue-600 hover:to-blue-500', // Set to 600
    },
    {
      name: 'indigo',
      light: 'bg-indigo-300',
      dark: 'bg-indigo-600',
      lightFrom: 'from-indigo-300 hover:from-indigo-400',
      lightTo: 'to-indigo-300 hover:to-indigo-400', // Set to 300
      darkFrom: 'from-indigo-600 hover:from-indigo-500',
      darkTo: 'to-indigo-600 hover:to-indigo-500', // Set to 600
    },
    {
      name: 'violet',
      light: 'bg-violet-300',
      dark: 'bg-violet-600',
      lightFrom: 'from-violet-300 hover:from-violet-400',
      lightTo: 'to-violet-300 hover:to-violet-400', // Set to 300
      darkFrom: 'from-violet-600 hover:from-violet-500',
      darkTo: 'to-violet-600 hover:to-violet-500', // Set to 600
    },
    {
      name: 'purple',
      light: 'bg-purple-300',
      dark: 'bg-purple-600',
      lightFrom: 'from-purple-300 hover:from-purple-400',
      lightTo: 'to-purple-300 hover:to-purple-400', // Set to 300
      darkFrom: 'from-purple-600 hover:from-purple-500',
      darkTo: 'to-purple-600 hover:to-purple-500', // Set to 600
    },
    {
      name: 'fuchsia',
      light: 'bg-fuchsia-300',
      dark: 'bg-fuchsia-600',
      lightFrom: 'from-fuchsia-300 hover:from-fuchsia-400',
      lightTo: 'to-fuchsia-300 hover:to-fuchsia-400', // Set to 300
      darkFrom: 'from-fuchsia-600 hover:from-fuchsia-500',
      darkTo: 'to-fuchsia-600 hover:to-fuchsia-500', // Set to 600
    },
    {
      name: 'pink',
      light: 'bg-pink-300',
      dark: 'bg-pink-600',
      lightFrom: 'from-pink-300 hover:from-pink-400',
      lightTo: 'to-pink-300 hover:to-pink-400', // Set to 300
      darkFrom: 'from-pink-600 hover:from-pink-500',
      darkTo: 'to-pink-600 hover:to-pink-500', // Set to 600
    },
    {
      name: 'rose',
      light: 'bg-rose-300',
      dark: 'bg-rose-600',
      lightFrom: 'from-rose-300 hover:from-rose-400',
      lightTo: 'to-rose-300 hover:to-rose-400', // Set to 300
      darkFrom: 'from-rose-600 hover:from-rose-500',
      darkTo: 'to-rose-600 hover:to-rose-500', // Set to 600
    },
  ];


  constructor() { }

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

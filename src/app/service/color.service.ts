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
      lightFrom: 'from-red-300',
      lightTo: 'to-red-300', // Set to 300
      darkFrom: 'from-red-600',
      darkTo: 'to-red-600', // Set to 600
    },
    {
      name: 'orange',
      light: 'bg-orange-300',
      dark: 'bg-orange-600',
      lightFrom: 'from-orange-300',
      lightTo: 'to-orange-300', // Set to 300
      darkFrom: 'from-orange-600',
      darkTo: 'to-orange-600', // Set to 600
    },
    {
      name: 'amber',
      light: 'bg-amber-300',
      dark: 'bg-amber-600',
      lightFrom: 'from-amber-300',
      lightTo: 'to-amber-300', // Set to 300
      darkFrom: 'from-amber-600',
      darkTo: 'to-amber-600', // Set to 600
    },
    {
      name: 'yellow',
      light: 'bg-yellow-300',
      dark: 'bg-yellow-600',
      lightFrom: 'from-yellow-300',
      lightTo: 'to-yellow-300', // Set to 300
      darkFrom: 'from-yellow-600',
      darkTo: 'to-yellow-600', // Set to 600
    },
    {
      name: 'lime',
      light: 'bg-lime-300',
      dark: 'bg-lime-600',
      lightFrom: 'from-lime-300',
      lightTo: 'to-lime-300', // Set to 300
      darkFrom: 'from-lime-600',
      darkTo: 'to-lime-600', // Set to 600
    },
    {
      name: 'green',
      light: 'bg-green-300',
      dark: 'bg-green-600',
      lightFrom: 'from-green-300',
      lightTo: 'to-green-300', // Set to 300
      darkFrom: 'from-green-600',
      darkTo: 'to-green-600', // Set to 600
    },
    {
      name: 'emerald',
      light: 'bg-emerald-300',
      dark: 'bg-emerald-600',
      lightFrom: 'from-emerald-300',
      lightTo: 'to-emerald-300', // Set to 300
      darkFrom: 'from-emerald-600',
      darkTo: 'to-emerald-600', // Set to 600
    },
    {
      name: 'teal',
      light: 'bg-teal-300',
      dark: 'bg-teal-600',
      lightFrom: 'from-teal-300',
      lightTo: 'to-teal-300', // Set to 300
      darkFrom: 'from-teal-600',
      darkTo: 'to-teal-600', // Set to 600
    },
    {
      name: 'cyan',
      light: 'bg-cyan-300',
      dark: 'bg-cyan-600',
      lightFrom: 'from-cyan-300',
      lightTo: 'to-cyan-300', // Set to 300
      darkFrom: 'from-cyan-600',
      darkTo: 'to-cyan-600', // Set to 600
    },
    {
      name: 'sky',
      light: 'bg-sky-300',
      dark: 'bg-sky-600',
      lightFrom: 'from-sky-300',
      lightTo: 'to-sky-300', // Set to 300
      darkFrom: 'from-sky-600',
      darkTo: 'to-sky-600', // Set to 600
    },
    {
      name: 'blue',
      light: 'bg-blue-300',
      dark: 'bg-blue-600',
      lightFrom: 'from-blue-300',
      lightTo: 'to-blue-300', // Set to 300
      darkFrom: 'from-blue-600',
      darkTo: 'to-blue-600', // Set to 600
    },
    {
      name: 'indigo',
      light: 'bg-indigo-300',
      dark: 'bg-indigo-600',
      lightFrom: 'from-indigo-300',
      lightTo: 'to-indigo-300', // Set to 300
      darkFrom: 'from-indigo-600',
      darkTo: 'to-indigo-600', // Set to 600
    },
    {
      name: 'violet',
      light: 'bg-violet-300',
      dark: 'bg-violet-600',
      lightFrom: 'from-violet-300',
      lightTo: 'to-violet-300', // Set to 300
      darkFrom: 'from-violet-600',
      darkTo: 'to-violet-600', // Set to 600
    },
    {
      name: 'purple',
      light: 'bg-purple-300',
      dark: 'bg-purple-600',
      lightFrom: 'from-purple-300',
      lightTo: 'to-purple-300', // Set to 300
      darkFrom: 'from-purple-600',
      darkTo: 'to-purple-600', // Set to 600
    },
    {
      name: 'fuchsia',
      light: 'bg-fuchsia-300',
      dark: 'bg-fuchsia-600',
      lightFrom: 'from-fuchsia-300',
      lightTo: 'to-fuchsia-300', // Set to 300
      darkFrom: 'from-fuchsia-600',
      darkTo: 'to-fuchsia-600', // Set to 600
    },
    {
      name: 'pink',
      light: 'bg-pink-300',
      dark: 'bg-pink-600',
      lightFrom: 'from-pink-300',
      lightTo: 'to-pink-300', // Set to 300
      darkFrom: 'from-pink-600',
      darkTo: 'to-pink-600', // Set to 600
    },
    {
      name: 'rose',
      light: 'bg-rose-300',
      dark: 'bg-rose-600',
      lightFrom: 'from-rose-300',
      lightTo: 'to-rose-300', // Set to 300
      darkFrom: 'from-rose-600',
      darkTo: 'to-rose-600', // Set to 600
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

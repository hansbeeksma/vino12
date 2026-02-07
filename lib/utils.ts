import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { BodyLevel, WineColor } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function formatPrice(price: number): string {
  return `€${price}`
}

export function bodyToNumber(body: BodyLevel): number {
  const map: Record<BodyLevel, number> = {
    Light: 1,
    'Light-Medium': 2,
    Medium: 3,
    'Medium-Full': 4,
    Full: 5,
  }
  return map[body]
}

export function colorHex(color: WineColor): string {
  return color === 'red' ? '#722F37' : '#00674F'
}

export function colorLabel(color: WineColor): string {
  return color === 'red' ? 'Rood' : 'Wit'
}

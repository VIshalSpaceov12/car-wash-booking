import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date and time to display in consistent timezone (Indian Standard Time)
export function formatBookingDateTime(dateString: string) {
  const date = new Date(dateString)
  
  // Format date
  const formattedDate = date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
  
  // Format time
  const formattedTime = date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  
  return { formattedDate, formattedTime }
}

// Format just the time in IST
export function formatBookingTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

// Format just the date in IST
export function formatBookingDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Convert IST time to UTC for database storage
export function convertISTToUTC(date: string, time: string): Date {
  // Create date string in IST timezone
  const istDateTime = `${date}T${time}:00+05:30`
  return new Date(istDateTime)
}

// Convert UTC time from database to IST for display
export function convertUTCToIST(utcDateString: string): Date {
  return new Date(utcDateString)
}
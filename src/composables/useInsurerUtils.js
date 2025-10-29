import { useInsurerStore } from '@/stores/insurerStore.js';
import { addMonths, addYears, addDays, format, differenceInCalendarDays } from 'date-fns';

export const allDocTypes = [
  'PDF (STANDARD) - CSV AUF WUNSCH MÖGLICH (PER MAIL ANFORDERN)',
  'PDF',
  'CSV',
  'XLS',
  'XML',
  'PAPIER',
  'Papier',
  'PAPIER (STANDARD) - CSV AUF WUNSCH MÖGLICH (PER MAIL ANFORDERN)'
];

const parseTurnus = (turnus) => {
  if (!turnus) {
    console.log('No turnus provided');
    return null;
  }
  
  // Convert to string if it's a number
  const turnusStr = String(turnus).trim().toLowerCase();
  console.log('Parsing turnus:', turnusStr);
  
  // Handle numeric turnus directly
  if (!isNaN(Number(turnusStr))) {
    const days = parseInt(turnusStr, 10);
    console.log('Numeric turnus, using as days:', days);
    return days; // CRITICAL FIX: Return immediately to prevent fall-through
  }
  
  // Extract number from turnus string (e.g., '14-tägig' -> 14, '14 tägig' -> 14, '14' -> 14)
  const match = turnusStr.match(/(\d+)/);
  
  if (match) {
    const days = parseInt(match[1], 10);
    console.log('Extracted days from turnus:', days);
    
    // Handle special cases like '14-tägig' (bi-weekly) vs '14 Tage' (every 14 days)
    if (turnusStr.includes('tägig') || turnusStr.includes('taegig') || 
        turnusStr.includes('täg') || turnusStr.includes('taeg')) {
      return days;
    } else if (turnusStr.includes('tag') || turnusStr.includes('tage')) {
      return days;
    } else if (turnusStr.includes('wochen') || turnusStr.includes('week')) {
      return days * 7;
    } else if (turnusStr.includes('monat') || turnusStr.includes('month')) {
      return days * 30;
    } else {
      // Default to days if no specific unit is mentioned
      return days;
    }
  }
  
  // Handle non-numeric turnus values
  else if (turnusStr.includes('täglich') || turnusStr.includes('taeglich') || turnusStr === '1') {
    console.log('Daily turnus detected');
    return 1;
  } else if (turnusStr.includes('wöchentlich') || turnusStr.includes('woechentlich') || turnusStr.includes('woche') || turnusStr === '7') {
    console.log('Weekly turnus detected');
    return 7;
  } else if (turnusStr.includes('14-tägig') || turnusStr === '14') {
    console.log('Bi-weekly turnus detected');
    return 14;
  } else if (turnusStr.includes('monatlich') || turnusStr.includes('monthly')) {
    console.log('Monthly turnus detected');
    return 30;
  } else if (turnusStr.includes('quartal') || turnusStr.includes('quarter')) {
    console.log('Quarterly turnus detected');
    return 90;
  } else if (turnusStr.includes('halbj') || turnusStr.includes('halbjähr')) {
    console.log('Half-yearly turnus detected');
    return 180;
  } else if (turnusStr.includes('jährlich') || turnusStr.includes('jaehrlich') || turnusStr.includes('yearly')) {
    console.log('Yearly turnus detected');
    return 365;
  }
  
  console.log('Could not determine turnus from:', turnusStr);
  return null;
};

export function useInsurerUtils() {
  const insurerStore = useInsurerStore();

  const parseDateString = (dateInput) => {
    console.log('parseDateString input:', dateInput);
    
    if (!dateInput) {
      console.log('No date input provided');
      return null;
    }
    
    try {
      // If it's already a Date object, return it
      if (dateInput instanceof Date) {
        if (isNaN(dateInput.getTime())) {
          console.log('Invalid Date object');
          return null;
        }
        console.log('Valid Date object:', dateInput);
        return new Date(dateInput);
      }
      
      // Handle Firestore timestamp
      if (dateInput.seconds) {
        const date = new Date(dateInput.seconds * 1000);
        console.log('Firestore timestamp:', date);
        return date;
      }
      
      // Handle string dates
      if (typeof dateInput === 'string') {
        const trimmedInput = dateInput.trim();
        console.log('Processing string date:', trimmedInput);
        
        // Handle ISO-like dates (YYYY-MM-DD) to avoid timezone issues.
        // new Date('2023-10-11') can be interpreted as UTC, causing off-by-one day errors.
        const isoMatch = trimmedInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) {
          const [_, year, month, day] = isoMatch.map(Number);
          // Construct as local date at midnight
          const localDate = new Date(year, month - 1, day, 0, 0, 0);
          console.log('Parsed as local ISO date:', localDate);
          return localDate;
        }

        // Try parsing other string formats, but be aware they might have timezone issues.
        let parsed = new Date(trimmedInput);
        if (!isNaN(parsed.getTime())) {
          console.log('Parsed as generic string:', parsed);
          return parsed;
        }
        
        // Try parsing German date format (DD.MM.YYYY or DD.MM.YY)
        const germanDateRegex = /^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/;
        const germanMatch = trimmedInput.match(germanDateRegex);
        
        if (germanMatch) {
          let [_, day, month, year] = germanMatch;
          day = parseInt(day, 10);
          month = parseInt(month, 10) - 1; // Month is 0-indexed
          year = parseInt(year, 10);
          
          // Handle 2-digit years (assume 20xx for years < 100)
          if (year < 100) {
            year += 2000;
          }
          
          const date = new Date(year, month, day);
          if (!isNaN(date.getTime())) {
            console.log('Parsed as German date format:', date);
            return date;
          }
        }
        
        // Try parsing other common formats
        const formats = [
          'yyyy-MM-dd', 'dd/MM/yyyy', 'MM/dd/yyyy',
          'yyyy/MM/dd', 'dd-MM-yyyy', 'MM-dd-yyyy'
        ];
        
        for (const format of formats) {
          const date = new Date(trimmedInput);
          if (!isNaN(date.getTime())) {
            console.log(`Parsed as ${format} format:`, date);
            return date;
          }
        }
        
        console.log('Could not parse date string:', trimmedInput);
        return null;
      }
      
      // Handle numeric timestamps (milliseconds or seconds since epoch)
      if (typeof dateInput === 'number') {
        // If it's in seconds, convert to milliseconds
        const timestamp = dateInput < 1e12 ? dateInput * 1000 : dateInput;
        const date = new Date(timestamp);
        
        if (!isNaN(date.getTime())) {
          console.log('Parsed as timestamp:', date);
          return date;
        }
      }
      
      console.log('Unrecognized date format:', dateInput);
      return null;
      
    } catch (error) {
      console.error('Error parsing date:', error, 'Input was:', dateInput);
      return null;
    }
  };

  const calculateDaysOverdue = (insurer, currentDate = new Date()) => {
    try {
      // --- Step 1: Reliably extract the invoice date from multiple possible sources ---
      let rawDate = null;
      const insurerInvoice = insurer.last_invoice;
      const storeInvoice = insurerStore.lastInvoices[insurer.id];

      // Prioritize the date from the main insurer object if it's valid
      if (insurerInvoice) {
        // It could be a string, a Firestore timestamp, or an object with a .date/.datum/.display property
        if (typeof insurerInvoice === 'string') rawDate = insurerInvoice;
        else if (insurerInvoice.seconds) rawDate = insurerInvoice;
        else if (insurerInvoice.date) rawDate = insurerInvoice.date;
        else if (insurerInvoice.datum) rawDate = insurerInvoice.datum;
        else if (insurerInvoice.display) rawDate = insurerInvoice.display;
      }

      // Fallback to the store if no valid date was found on the insurer object
      if (!rawDate && storeInvoice) {
        if (typeof storeInvoice === 'string') rawDate = storeInvoice;
        else if (storeInvoice.seconds) rawDate = storeInvoice;
        else if (storeInvoice.date) rawDate = storeInvoice.date;
        else if (storeInvoice.datum) rawDate = storeInvoice.datum;
        else if (storeInvoice.display) rawDate = storeInvoice.display;
      }

      if (!rawDate) {
        return null; // No valid date source found
      }

      // --- Step 2: Parse the extracted date string robustly ---
      const lastInvoiceDate = parseDateString(rawDate);
      if (!lastInvoiceDate) {
        return null; // Date parsing failed
      }

      // --- Step 3: Parse the turnus period ---
      const turnusDays = parseTurnus(insurer.turnus);
      if (turnusDays === null || isNaN(turnusDays)) {
        return null; // Turnus is invalid
      }

      // --- Step 4: Calculate the due date at local midnight ---
      const base = new Date(lastInvoiceDate);
      base.setHours(0, 0, 0, 0);
      const dueDate = addDays(base, turnusDays);
      const cleanDueDate = new Date(dueDate);
      cleanDueDate.setHours(0, 0, 0, 0);

      // --- Step 5: Use calendar-day difference to avoid timezone drift ---
      const today = new Date(currentDate);
      today.setHours(0, 0, 0, 0);
      const diffDays = differenceInCalendarDays(today, cleanDueDate);

      // Negative => future, 0 => due today, positive => overdue days
      return diffDays;

    } catch (error) {
      console.error('Error in calculateDaysOverdue:', error, 'Insurer:', insurer);
      return null; // Unknown/invalid -> let callers handle as not overdue
    }
  };


  const formatLastInvoice = (lastInvoice) => {
    if (!lastInvoice) return '–';
    
    const date = parseDateString(lastInvoice);
    if (!date) return 'Ungültiges Datum';
    
    return format(date, 'dd.MM.yyyy');
  };

  const formatSettlementDate = (date) => {
    if (!date) return '–';
    
    const dateObj = parseDateString(date);
    if (!dateObj) return 'Ungültiges Datum';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = dateObj - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Vor ${Math.abs(diffDays)} Tag${Math.abs(diffDays) !== 1 ? 'en' : ''}`;
    } else if (diffDays === 0) {
      return 'Heute';
    } else {
      return `In ${diffDays} Tag${diffDays !== 1 ? 'en' : ''}`;
    }
  };

  const getNormalizedDocTypes = (docTypes) => {
    // Handle null/undefined
    if (!docTypes) return [];
    
    // Handle string input (comma-separated values or single value)
    if (typeof docTypes === 'string') {
      return docTypes.split(',')
        .map(type => type.trim())
        .filter(type => type && type !== 'NULL' && type !== 'UNDEFINED');
    }
    
    // Handle array input
    if (Array.isArray(docTypes)) {
      return docTypes
        .map(type => {
          if (typeof type === 'string') {
            return type.trim();
          }
          return null;
        })
        .filter(type => type && type !== 'NULL' && type !== 'UNDEFINED');
    }
    
    return [];
  };

  // Cache to store calculated next due dates by insurer ID
  const nextDueDateCache = new Map();
  
  const calculateNextSettlementDate = (insurer, currentDate = new Date()) => {
    console.group('calculateNextSettlementDate');
    try {
      if (!insurer) {
        console.log('No insurer provided');
        return null;
      }
      
      if (!insurer.turnus) {
        console.log('No turnus found for insurer');
        return null;
      }
      
      // Create a clean date object for the reference date (no time component)
      const referenceDate = new Date(currentDate);
      referenceDate.setHours(12, 0, 0, 0);
      
      // Create a cache key based on the reference date
      const cacheKey = `${insurer.id}_${referenceDate.toISOString().split('T')[0]}`;
      
      // Check if we have a cached result for this insurer and date
      if (nextDueDateCache.has(cacheKey)) {
        const cachedDate = new Date(nextDueDateCache.get(cacheKey));
        console.log('Using cached next due date:', cachedDate);
        return cachedDate;
      }
      
      console.log('Calculating next settlement date for insurer:', insurer.name);
      console.log('Reference date:', referenceDate.toISOString());
      
      // Parse the turnus to get the number of days
      const turnusDays = parseTurnus(insurer.turnus);
      console.log('Parsed turnus days:', turnusDays, 'from turnus:', insurer.turnus);
      
      if (!turnusDays) {
        console.log('Could not parse turnus');
        return null;
      }
      
      // Helper function to parse various date formats
      const parseDateFromObject = (dateObj) => {
        console.log('parseDateFromObject input:', dateObj);
        
        if (!dateObj) {
          console.log('No date object provided');
          return null;
        }
        
        // Handle Firestore Timestamp
        if (dateObj.seconds) {
          const date = new Date(dateObj.seconds * 1000);
          console.log('Firestore Timestamp:', date);
          return date;
        }
        
        // Handle nested date object with seconds
        if (dateObj.date?.seconds) {
          const date = new Date(dateObj.date.seconds * 1000);
          console.log('Nested date with seconds:', date);
          return date;
        }
        
        // Handle datum field
        if (dateObj.datum) {
          console.log('Datum field found:', dateObj.datum);
          return parseDateString(dateObj.datum);
        }
        
        // Handle display field (common in some date objects)
        if (dateObj.display) {
          console.log('Display field found:', dateObj.display);
          const displayDate = parseDateString(dateObj.display);
          if (displayDate) return displayDate;
        }
        
        // Handle string dates
        if (typeof dateObj === 'string') {
          console.log('String date found:', dateObj);
          const parsedDate = parseDateString(dateObj);
          if (parsedDate) return parsedDate;
          
          // Try to parse as ISO string
          const isoDate = new Date(dateObj);
          if (!isNaN(isoDate.getTime())) {
            console.log('Parsed as ISO string:', isoDate);
            return isoDate;
          }
        }
        
        // Handle Date objects
        if (dateObj instanceof Date) {
          if (isNaN(dateObj.getTime())) {
            console.log('Invalid Date object');
            return null;
          }
          console.log('Valid Date object:', dateObj);
          return new Date(dateObj);
        }
        
        // Try to parse any object with date properties
        if (typeof dateObj === 'object') {
          // Check for common date properties
          const possibleDateStrings = [
            dateObj.date,
            dateObj.datum,
            dateObj.display,
            dateObj.formatted,
            dateObj.value,
            dateObj.timestamp
          ].filter(Boolean);
          
          for (const dateStr of possibleDateStrings) {
            const parsed = parseDateFromObject(dateStr);
            if (parsed) {
              console.log('Found date in object property:', dateStr, '->', parsed);
              return parsed;
            }
          }
        }
        
        console.log('Could not parse date from object:', JSON.stringify(dateObj));
        return null;
      };
      
      // Get the last invoice date - this is our base date
      const lastInvoiceDate = parseDateFromObject(insurer.last_invoice);
      
      if (!lastInvoiceDate) {
        console.log('No last invoice date found');
        return null;
      }
      
      console.log('Last invoice date:', lastInvoiceDate);
      
      // Create a clean date object for the base date (last invoice date)
      const baseDate = new Date(lastInvoiceDate);
      baseDate.setHours(12, 0, 0, 0);
      
      // Calculate the next due date by adding the turnus to the last invoice date
      let nextDueDate = new Date(baseDate);
      
      // For monthly cycles (28-31 days), handle them differently
      if (turnusDays >= 28 && turnusDays <= 31) {
        // For monthly cycles, add 1 month to the last invoice date
        const nextMonth = nextDueDate.getMonth() + 1;
        const nextYear = nextDueDate.getFullYear() + Math.floor(nextMonth / 12);
        const month = nextMonth % 12;
        
        // Make sure the day exists in the next month (e.g., handle Jan 31 → Feb 28/29)
        const daysInNextMonth = new Date(nextYear, month + 1, 0).getDate();
        const dayToUse = Math.min(nextDueDate.getDate(), daysInNextMonth);
        
        nextDueDate = new Date(nextYear, month, dayToUse, 12, 0, 0, 0);
        console.log('Monthly cycle. Next due date:', nextDueDate);
      } else {
        // For non-monthly cycles, simply add the turnus days to the last invoice date
        nextDueDate.setDate(nextDueDate.getDate() + turnusDays);
        nextDueDate.setHours(12, 0, 0, 0);
        console.log(`Added ${turnusDays} days. Next due:`, nextDueDate);
      }
      
      console.log('Final calculated next due date:', nextDueDate.toISOString());
      
      // Cache the result for this insurer and date
      nextDueDateCache.set(cacheKey, new Date(nextDueDate));
      
      return new Date(nextDueDate);
      
    } catch (error) {
      console.error('Error calculating next settlement date:', error);
      return null;
    } finally {
      console.groupEnd();
    }
  };

  // Helper function to safely parse date values
  const safeParseDate = (dateValue) => {
    if (!dateValue) return new Date();
    if (dateValue instanceof Date) return new Date(dateValue);
    if (typeof dateValue === 'string' || typeof dateValue === 'number') {
      const parsed = new Date(dateValue);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    }
    return new Date();
  };


  const getStatusCode = (insurer, currentDate) => {
    const daysOverdue = calculateDaysOverdue(insurer, currentDate);
    // Status is 'red' on the due day (daysOverdue >= 0) or later.
    if (daysOverdue >= 0) {
      return { status: 'red', days: daysOverdue };
    }
    // Otherwise, the status is 'green'.
    return { status: 'green', days: daysOverdue };
  };

  // Export all utility functions
  return {
    formatLastInvoice,
    formatSettlementDate,
    calculateDaysOverdue,
    getNormalizedDocTypes,
    calculateNextSettlementDate,
    parseDateString,
    parseTurnus,
    getStatusCode // Export the new function
  };
}

export default useInsurerUtils;

import { useInsurerStore } from '@/stores/insurerStore.js';
import { addMonths, addYears, addDays } from 'date-fns';

export const allDocTypes = ['PDF', 'CSV', 'XLS', 'XML', 'Papier'];

export const docTypeColors = {
  'PDF': { classes: 'bg-red-100 text-red-800', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>' },
  'CSV': { classes: 'bg-blue-100 text-blue-800', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>' },
  'XLS': { classes: 'bg-green-100 text-green-800', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>' },
  'XML': { classes: 'bg-indigo-100 text-indigo-800', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l-4 4-4-4-4 4"></path>' },
  'Papier': { classes: 'bg-gray-100 text-gray-800', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>' }
};

export function useInsurerUtils() {

    const parseDateString = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return null;
    try {
      // Handle formats like '23.07.2025, 00:00:00'
      const datePart = dateStr.split(',')[0].trim();
      const parts = datePart.split('.');
      
      if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          // Create date in UTC to avoid timezone issues
          const d = new Date(Date.UTC(year, month - 1, day));
          if (!isNaN(d.getTime())) return d;
        }
      }

      // Fallback for ISO strings or other formats recognized by new Date()
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) return d;

      return null;
    } catch (error) {
      return null;
    }
  };

  const parseInvoiceDate = (invoice) => {
    if (!invoice) return null;

    // Handle Firebase Timestamp object: { date: { seconds: ... } }
    if (invoice.date && typeof invoice.date.seconds === 'number') {
      return new Date(invoice.date.seconds * 1000);
    }

    // Handle plain string date
    if (typeof invoice === 'string') {
      return parseDateString(invoice);
    }

    // Handle object with 'datum' or 'display' property
    if (typeof invoice === 'object') {
      if (typeof invoice.datum === 'string') return parseDateString(invoice.datum);
      if (typeof invoice.display === 'string') return parseDateString(invoice.display);
    }

    return null;
  };

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
      return days;
    }
    
    // Extract number from turnus string (e.g., '14-tägig' -> 14, '14 tägig' -> 14, '14' -> 14)
    const match = turnusStr.match(/(\d+)/);
    
    if (match) {
      const days = parseInt(match[1], 10);
      console.log('Extracted days from turnus:', days);
      
      // Handle special cases like '14-tägig' (bi-weekly) vs '14 Tage' (every 14 days)
      if (turnusStr.includes('tägig') || turnusStr.includes('taegig')) {
        // '14-tägig' means every 14 days
        return days;
      } else if (turnusStr.includes('tag') || turnusStr.includes('tage')) {
        // '14 Tage' means every 14 days
        return days;
      } else if (turnusStr.includes('wochen') || turnusStr.includes('week')) {
        // '2 wochen' means every 14 days
        return days * 7;
      } else if (turnusStr.includes('monat') || turnusStr.includes('month')) {
        // '1 monat' means ~30 days
        return days * 30;
      } else {
        // Default to days if no specific unit is mentioned
        return days;
      }
    }
    
    // Handle non-numeric turnus values
    if (turnusStr.includes('täglich') || turnusStr.includes('taeglich') || turnusStr === '1') {
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

  // Cache for memoizing calculateDaysOverdue results
  const daysOverdueCache = new Map();
  
  const calculateDaysOverdue = (insurer, currentDate, lastInvoices = null) => {
    try {
      console.group(`calculateDaysOverdue for ${insurer?.name || insurer?.id || 'unknown'}`);
      
      // Create a cache key based on insurer ID and current date
      const cacheKey = `${insurer?.id}_${currentDate?.getTime()}`;
      
      // Return cached result if available
      if (daysOverdueCache.has(cacheKey)) {
        const cached = daysOverdueCache.get(cacheKey);
        console.log('Using cached result:', cached);
        console.groupEnd();
        return cached;
      }
      
      // If no insurer or no current date, cache and return 0 (not overdue)
      if (!insurer || !currentDate) {
        console.log('No insurer or current date provided');
        daysOverdueCache.set(cacheKey, 0);
        console.groupEnd();
        return 0;
      }
      
      // Early return if no turnus is set
      if (!insurer.turnus || (typeof insurer.turnus !== 'string') || !insurer.turnus.trim()) {
        console.log('No turnus set for insurer:', insurer.id);
        daysOverdueCache.set(cacheKey, 0);
        console.groupEnd();
        return 0;
      }
      
      // Normalize current date
      const today = new Date(currentDate);
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(today.getTime())) {
        console.error('Invalid current date:', currentDate);
        console.groupEnd();
        return 0;
      }
      
      console.log('Current date (normalized):', today);
      const todayTime = today.getTime();
      let dueDate = null;
      const turnus = insurer.turnus.toLowerCase();
      console.log('Turnus value:', turnus);
      
      // 1. First try to get invoice from lastInvoices prop if available
      let invoice = null;
      if (lastInvoices && typeof lastInvoices === 'object' && lastInvoices[insurer.id]) {
        console.log('Using lastInvoices prop for invoice data');
        invoice = lastInvoices[insurer.id];
      } 
      // 2. Fall back to insurer.last_invoice if no lastInvoices data
      if (!invoice && insurer.last_invoice) {
        console.log('Using insurer.last_invoice for invoice data');
        invoice = insurer.last_invoice;
      }
      
      console.log('Available invoice data:', invoice);
      
      // Process the invoice data if available
      if (invoice) {
        console.log('Found invoice:', invoice);
        let lastInvoiceDate = null;
        
        // Handle different invoice data formats
        if (invoice.date) {
          lastInvoiceDate = invoice.date.seconds ? new Date(invoice.date.seconds * 1000) : new Date(invoice.date);
        } else if (invoice.datum) {
          lastInvoiceDate = new Date(invoice.datum);
        } else if (typeof invoice === 'string') {
          lastInvoiceDate = new Date(invoice);
        } else if (invoice.seconds) {
          lastInvoiceDate = new Date(invoice.seconds * 1000);
        }
        
        // If we couldn't parse the date, try to get it from the formatted display string
        if ((!lastInvoiceDate || isNaN(lastInvoiceDate.getTime())) && invoice.display) {
          const dateMatch = invoice.display.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
          if (dateMatch) {
            lastInvoiceDate = new Date(`${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`);
          }
        }
        
        console.log('Parsed invoice date:', lastInvoiceDate);
        
        if (lastInvoiceDate && !isNaN(lastInvoiceDate.getTime())) {
          const turnusDays = parseTurnus(turnus);
          console.log('Parsed turnus days:', turnusDays);
          
          if (turnusDays !== null && !isNaN(turnusDays)) {
            dueDate = addDays(new Date(lastInvoiceDate), turnusDays);
            console.log('Calculated due date from invoice:', dueDate);
          } else {
            console.error('Invalid turnus days:', turnusDays);
          }
        } else {
          console.error('Could not parse invoice date from:', invoice);
        }
      }
      
      // 2. Fallback to next_due if needed
      if (!dueDate && insurer.next_due) {
        console.log('Using next_due as fallback:', insurer.next_due);
        if (insurer.next_due.seconds) {
          dueDate = new Date(insurer.next_due.seconds * 1000);
        } else if (insurer.next_due instanceof Date) {
          dueDate = new Date(insurer.next_due);
        } else if (typeof insurer.next_due === 'string') {
          dueDate = new Date(insurer.next_due);
        }
        console.log('Parsed due date from next_due:', dueDate);
      }
      
      // If no due date could be determined
      if (!dueDate) {
        console.log('No valid due date could be determined');
        
        // If we have no invoice data at all, consider it not overdue
        if (!invoice && !insurer.last_invoice) {
          console.log('No invoice data available, considering not overdue');
          daysOverdueCache.set(cacheKey, 0);
          console.groupEnd();
          return 0;
        }
        
        // In development, return a test value to verify status colors
        if (process.env.NODE_ENV === 'development') {
          console.log('DEV: Returning test overdue value of 10 days');
          daysOverdueCache.set(cacheKey, 10);
          console.groupEnd();
          return 10;
        }
        
        // Default to not overdue if we can't determine a due date
        daysOverdueCache.set(cacheKey, 0);
        console.groupEnd();
        return 0;
      }
      
      // If we have a valid due date, calculate days overdue
      if (dueDate && !isNaN(dueDate.getTime())) {
        dueDate.setHours(0, 0, 0, 0);
        const dueTime = dueDate.getTime();
        const diffDays = Math.floor((todayTime - dueTime) / (1000 * 60 * 60 * 24));
        
        // Only return positive values (overdue) or 0 (not overdue)
        const result = Math.max(0, diffDays);
        
        console.log('Due date:', dueDate);
        console.log('Today:', today);
        console.log('Difference in days:', diffDays);
        console.log('Final result (days overdue):', result);
        
        // Cache the result
        daysOverdueCache.set(cacheKey, result);
        console.groupEnd();
        return result;
      }
    } catch (error) {
      console.error('Error in calculateDaysOverdue:', error);
      return 0; // Return 0 (not overdue) in case of any error
    }
  };

        const getStatusCode = (insurer, date, lastInvoices) => {
    console.group(`getStatusCode for ${insurer?.name || 'unknown'}`);
    console.log('Input date:', date);
    console.log('Insurer:', insurer);
    console.log('Last invoice date:', insurer.last_invoice);
    console.log('Turnus:', insurer.turnus);
    
    const daysOverdue = calculateDaysOverdue(insurer, date, lastInvoices);
    console.log('Days overdue:', daysOverdue);
    
    let status;
    if (daysOverdue > 5) {
      status = 'red'; // Critical: More than 5 days overdue
    } else if (daysOverdue >= 1) {
      status = 'yellow'; // Warning: 1-5 days overdue
    } else {
      status = 'green'; // OK: On time or not yet due
    }
    
    console.log('Final status:', status);
    console.groupEnd();
    return status;
  };

  const getStatusColor = (insurer, date, lastInvoices) => {
    console.group(`getStatusColor for ${insurer?.name || 'unknown'}`);
    console.log('Input date:', date);
    console.log('Date type:', Object.prototype.toString.call(date));
    console.log('Last invoices:', lastInvoices);
    console.log('Insurer ID:', insurer?.id);
    console.log('Turnus value:', insurer?.turnus);
    
    const code = getStatusCode(insurer, date, lastInvoices);
    console.log('Status code:', code);
    
    let colorClass;
    switch (code) {
      case 'red': 
        colorClass = 'bg-red-500';
        console.log('Setting status to RED - Critical (more than 5 days overdue)');
        break;
      case 'yellow': 
        colorClass = 'bg-yellow-500';
        console.log('Setting status to YELLOW - Warning (1-5 days overdue)');
        break;
      default: 
        colorClass = 'bg-green-500';
        console.log('Setting status to GREEN - On time or not yet due');
    }
    
    console.log('Final color class:', colorClass);
    console.groupEnd();
    return colorClass;
  };

  const getStatusText = (insurer, date, lastInvoices) => {
    const daysOverdue = calculateDaysOverdue(insurer, date, lastInvoices);
    if (daysOverdue > 0) return `${daysOverdue} Tage überfällig`;
    return 'Im Plan';
  };

  const formatLastInvoice = (lastInvoice) => {
    if (!lastInvoice) return '';

    // Handle Firestore Timestamp
    if (typeof lastInvoice.toDate === 'function') {
      return lastInvoice.toDate().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    // Handle string date
    if (typeof lastInvoice === 'string') {
      try {
        const date = new Date(lastInvoice);
        return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
      } catch (e) {
        return lastInvoice; // Return original string if parsing fails
      }
    }

    // Handle object with display or datum property
    if (lastInvoice.display) return lastInvoice.display;
    if (lastInvoice.datum) {
      try {
        const date = new Date(lastInvoice.datum);
        return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
      } catch (e) {
        return lastInvoice.datum;
      }
    }

    return '';
  };

  const formatSettlementDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getNormalizedDocTypes = (docTypes) => {
    if (!docTypes) return [];
    let rawTypes = [];

    if (Array.isArray(docTypes)) {
      rawTypes = docTypes;
    } else if (typeof docTypes === 'string') {
      rawTypes = docTypes.split(/[,.\s]+/).filter(Boolean);
    }

    const normalized = rawTypes.map(t => t.toUpperCase().trim()).filter(t => allDocTypes.includes(t));
    return [...new Set(normalized)];
  };

  return { 
    getStatusCode,
    getStatusColor, 
    getStatusText, 
    formatLastInvoice, 
    formatSettlementDate, 
    calculateDaysOverdue, 
    getNormalizedDocTypes
  };
}

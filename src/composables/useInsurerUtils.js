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
    if (!turnus) return null;
    
    // Convert to string if it's a number
    const turnusStr = String(turnus).trim().toLowerCase();
    console.log('Parsing turnus:', turnusStr);
    
    // Extract number from turnus string (e.g., '14-tägig' -> 14)
    const match = turnusStr.match(/(\d+)/);
    if (!match) {
      // Check for non-numeric turnus values like 'monatlich', 'jährlich', etc.
      if (turnusStr.includes('monatlich')) return 30;  // Approximate month as 30 days
      if (turnusStr.includes('quartal')) return 90;    // Approximate quarter as 90 days
      if (turnusStr.includes('halbj') || turnusStr.includes('halbjähr')) return 180; // Half year as 180 days
      if (turnusStr.includes('jährlich') || turnusStr.includes('jaehrlich')) return 365; // Year as 365 days
      
      console.log('No number found in turnus and no known period matched');
      return null;
    }
    
    const days = parseInt(match[1], 10);
    console.log('Extracted days from turnus:', days);
    return days;
  };

  // Cache for memoizing calculateDaysOverdue results
  const daysOverdueCache = new Map();
  
  const calculateDaysOverdue = (insurer, currentDate, lastInvoices) => {
    // Create a cache key based on insurer ID and current date
    const cacheKey = `${insurer?.id}_${currentDate?.getTime()}`;
    
    // Return cached result if available
    if (daysOverdueCache.has(cacheKey)) {
      return daysOverdueCache.get(cacheKey);
    }
    
    // If no insurer or no current date, cache and return 0 (not overdue)
    if (!insurer || !currentDate) {
      daysOverdueCache.set(cacheKey, 0);
      return 0;
    }
    
    // Early return if no turnus is set
    if (!insurer.turnus || (typeof insurer.turnus !== 'string') || !insurer.turnus.trim()) {
      daysOverdueCache.set(cacheKey, 0);
      return 0;
    }
    
    // Use timestamp for calculations to avoid Date object overhead
    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    
    let dueDate = null;
    const turnus = insurer.turnus.toLowerCase();
    
    // 1. Try to calculate from last invoice
    const invoice = lastInvoices?.[insurer.id] ?? insurer?.last_invoice;
    
    if (invoice) {
      const lastInvoiceDate = parseInvoiceDate(invoice);
      if (lastInvoiceDate) {
        const invoiceDate = new Date(lastInvoiceDate);
        const turnusDays = parseTurnus(turnus);
        
        if (turnusDays !== null) {
          dueDate = addDays(invoiceDate, turnusDays);
        }
      }
    }
    
    // 2. Fallback to next_due if needed
    if (!dueDate && insurer.next_due) {
      if (insurer.next_due.seconds) {
        dueDate = new Date(insurer.next_due.seconds * 1000);
      } else if (insurer.next_due instanceof Date) {
        dueDate = new Date(insurer.next_due);
      } else if (typeof insurer.next_due === 'string') {
        dueDate = new Date(insurer.next_due);
      }
    }
    
    // Return 0 if no valid due date
    if (!dueDate || isNaN(dueDate.getTime())) {
      daysOverdueCache.set(cacheKey, 0);
      return 0;
    }
    
    // Normalize due date and calculate difference
    dueDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((todayTime - dueDate.getTime()) / 86400000);
    const result = Math.max(0, diffDays);
    
    // Cache the result
    daysOverdueCache.set(cacheKey, result);
    return result;
  };

        const getStatusCode = (insurer, date, lastInvoices) => {
    console.group(`getStatusCode for ${insurer?.name || 'unknown'}`);
    console.log('Input date:', date);
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
    
    console.log('Status:', status);
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

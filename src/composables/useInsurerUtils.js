import { useInsurerStore } from '@/stores/insurerStore';
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

            const calculateDaysOverdue = (insurer, currentDate, lastInvoices) => {
    if (!insurer) return 0;

    // Ensure we have a valid turnus value to work with.
    if (!insurer.turnus || typeof insurer.turnus !== 'string' || insurer.turnus.trim() === '') {
      return 0;
    }

    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);

    let dueDate = null;

    // 1. Try to calculate from last invoice
            const invoice = lastInvoices?.[insurer.id] ?? insurer.last_invoice;
    if (invoice) {
      const lastInvoiceDate = parseInvoiceDate(invoice);
      if (lastInvoiceDate) {
        const turnus = insurer.turnus.toLowerCase();
        if (turnus.includes('7') || turnus.includes('wöchentlich')) {
          dueDate = addDays(lastInvoiceDate, 7);
        } else if (turnus.includes('monatlich')) {
          dueDate = addMonths(lastInvoiceDate, 1);
        } else if (turnus.includes('quartalsweise')) {
          dueDate = addMonths(lastInvoiceDate, 3);
        } else if (turnus.includes('halbjährlich')) {
          dueDate = addMonths(lastInvoiceDate, 6);
        } else if (turnus.includes('jährlich')) {
          dueDate = addYears(lastInvoiceDate, 1);
        }
      }
    }

    // 2. If no due date from invoice, fallback to next_due field
    if (!dueDate && insurer.next_due?.seconds) {
      dueDate = new Date(insurer.next_due.seconds * 1000);
    }

    // 3. If we still don't have a due date, we can't calculate anything.
    if (!dueDate) {
      return 0;
    }

    dueDate.setHours(0, 0, 0, 0);

    // 4. Calculate the difference
    if (today <= dueDate) {
      return 0;
    }

    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

        const getStatusCode = (insurer, date, lastInvoices) => {
    const daysOverdue = calculateDaysOverdue(insurer, date, lastInvoices);
    if (daysOverdue > 5) return 'red'; // Critical: More than 5 days overdue
    if (daysOverdue >= 1 && daysOverdue <= 5) return 'yellow'; // Warning: 1-5 days overdue
    return 'green'; // OK: On time or not yet due
  };

  const getStatusColor = (insurer, date, lastInvoices) => {
    const code = getStatusCode(insurer, date, lastInvoices);
    switch (code) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
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

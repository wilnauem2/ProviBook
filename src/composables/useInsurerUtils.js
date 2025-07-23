import { useInsurerStore } from '@/stores/insurerStore';
import { addMonths, addYears } from 'date-fns';

export const allDocTypes = ['PDF', 'CSV', 'XLS', 'XML', 'Papier'];

export const docTypeColors = {
  'PDF': { classes: 'bg-red-100 text-red-800', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>' },
  'CSV': { classes: 'bg-blue-100 text-blue-800', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>' },
  'XLS': { classes: 'bg-green-100 text-green-800', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>' },
  'XML': { classes: 'bg-indigo-100 text-indigo-800', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l-4 4-4-4-4 4"></path>' },
  'Papier': { classes: 'bg-gray-100 text-gray-800', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>' }
};

export function useInsurerUtils() {
  const insurerStore = useInsurerStore();

  const parseDateString = (dateStr) => {
    try {
      const [datePart] = dateStr.split(',');
      const [day, month, year] = datePart.trim().split('.').map(Number);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month - 1, day);
      }
      return new Date(dateStr); // Fallback for ISO strings
    } catch (error) {
      console.error('Error parsing date string:', dateStr, error);
      return null;
    }
  };

  const parseInvoiceDate = (invoice) => {
    if (!invoice) return null;
    if (typeof invoice === 'object' && invoice !== null) {
      if (invoice.timestamp) return new Date(invoice.timestamp);
      if (invoice.date) return new Date(invoice.date);
      if (invoice.display) return parseDateString(invoice.display);
      return null;
    }
    if (typeof invoice === 'string') {
      return parseDateString(invoice);
    }
    return null;
  };

          const calculateDaysOverdue = (insurer, currentDate = new Date(), lastInvoice = null) => {
    if (!insurer) return 0;

    const today = new Date(currentDate);
    today.setHours(0, 0, 0, 0);

    let dueDate = null;

    // 1. Try to calculate from last invoice
    const invoice = lastInvoice || insurer.last_invoice;
    if (invoice && insurer.turnus) {
      const lastInvoiceDate = parseInvoiceDate(invoice);
      if (lastInvoiceDate) {
        switch (insurer.turnus) {
          case 'monatlich':
            dueDate = addMonths(lastInvoiceDate, 1);
            break;
          case 'quartalsweise':
            dueDate = addMonths(lastInvoiceDate, 3);
            break;
          case 'halbjährlich':
            dueDate = addMonths(lastInvoiceDate, 6);
            break;
          case 'jährlich':
            dueDate = addYears(lastInvoiceDate, 1);
            break;
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

      const getStatusCode = (insurer, date, lastInvoice = null) => {
    const daysOverdue = calculateDaysOverdue(insurer, date, lastInvoice);
    if (daysOverdue > 5) return 'red';
    if (daysOverdue > 0) return 'yellow';
    return 'green';
  };

  const getStatusColor = (insurer, date, lastInvoice = null) => {
    const code = getStatusCode(insurer, date, lastInvoice);
    switch (code) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getStatusText = (insurer, date) => {
    const daysOverdue = calculateDaysOverdue(insurer, date);
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

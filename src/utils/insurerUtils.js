const parseInvoiceDate = (invoice) => {
  if (!invoice) return null;
  
  // Handle the new format where last_invoice is an object with display and timestamp
  if (typeof invoice === 'object' && invoice !== null) {
    // If we have a timestamp, use it directly
    if (invoice.timestamp) {
      return new Date(invoice.timestamp);
    }
    // Otherwise try to parse the display string
    if (invoice.display) {
      return parseDateString(invoice.display);
    }
    return null;
  }
  
  // Handle the old string format (backward compatibility)
  if (typeof invoice === 'string') {
    return parseDateString(invoice);
  }
  
  return null;
};

const parseDateString = (dateStr) => {
  try {
    // Handle format: "DD.MM.YYYY, HH:MM" or just "DD.MM.YYYY"
    const [datePart, timePart] = dateStr.split(',').map(s => s.trim());
    const [day, month, year] = datePart.split('.').map(Number);
    
    // If we have time, parse it, otherwise use start of day
    if (timePart) {
      const [hours, minutes] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes);
    }
    
    return new Date(year, month - 1, day);
  } catch (error) {
    console.error('Error parsing date string:', dateStr, error);
    return null;
  }
};

export const calculateDaysOverdue = (insurer, currentDate = null) => {
  if (!insurer?.last_invoice || !insurer?.turnus) return 0;
  
  try {
    const invoiceDate = parseInvoiceDate(insurer.last_invoice);
    if (!invoiceDate) return 0;
    
    const now = currentDate || new Date();
    const turnusMatch = insurer.turnus.match(/(\d+)-tägig/);
    
    if (!turnusMatch) return 0;
    
    const turnusDays = parseInt(turnusMatch[1]);
    
    // Calculate the expected invoice date (current date - turnus period)
    const expectedInvoiceDate = new Date(now);
    expectedInvoiceDate.setDate(expectedInvoiceDate.getDate() - turnusDays);
    
    // If the last invoice is more recent than the expected date, it's not overdue
    if (invoiceDate >= expectedInvoiceDate) {
      return 0;
    }
    
    // Calculate days overdue as the difference between expected invoice date and actual invoice date
    const daysOverdue = Math.floor((expectedInvoiceDate - invoiceDate) / (1000 * 60 * 60 * 24));
    return Math.max(1, daysOverdue);
  } catch (error) {
    console.error('Error calculating days overdue:', error);
    return 0;
  }
};

export const isOverdue = (insurer, currentDate = null) => {
  if (!insurer?.last_invoice || !insurer?.turnus) return false;
  
  try {
    const invoiceDate = parseInvoiceDate(insurer.last_invoice);
    if (!invoiceDate) return false;
    
    const now = currentDate || new Date();
    const turnusMatch = insurer.turnus.match(/(\d+)-tägig/);
    
    if (!turnusMatch) return false;
    
    const turnusDays = parseInt(turnusMatch[1]);
    
    // Calculate the expected invoice date (current date - turnus period)
    const expectedInvoiceDate = new Date(now);
    expectedInvoiceDate.setDate(expectedInvoiceDate.getDate() - turnusDays);
    
    // If the last invoice is older than the expected date, it's overdue
    return invoiceDate < expectedInvoiceDate;
  } catch (error) {
    console.error('Error checking overdue status:', error);
    return false;
  }
};

export const isWithinTurnus = (insurer, currentDate = null) => {
  if (!insurer?.last_invoice || !insurer?.turnus) return false
  
  try {
    const invoiceDate = parseInvoiceDate(insurer.last_invoice);
    if (!invoiceDate) return false;
    
    const now = currentDate || new Date();
    const turnusMatch = insurer.turnus.match(/(\d+)-tägig/);
    
    if (!turnusMatch) return false;
    
    const turnusDays = parseInt(turnusMatch[1]);
    
    // Calculate the expected invoice date (current date - turnus period)
    const expectedInvoiceDate = new Date(now);
    expectedInvoiceDate.setDate(expectedInvoiceDate.getDate() - turnusDays);
    
    // Add a 2-day buffer for processing time
    const bufferDays = 2;
    const bufferDate = new Date(expectedInvoiceDate);
    bufferDate.setDate(bufferDate.getDate() - bufferDays); // Buffer is subtracted since we're comparing against an older date
    
    // If the last invoice is newer than or equal to the expected date minus buffer, it's within turnus
    return invoiceDate >= bufferDate;
  } catch (error) {
    console.error('Error checking turnus status:', error);
    return false;
  }
};

export const getStatusColor = (insurer, currentDate = null) => {
  if (!insurer?.last_invoice || !insurer?.turnus) return 'gray';
  
  try {
    const daysOverdue = calculateDaysOverdue(insurer, currentDate);
    if (daysOverdue > 5) return 'red';
    if (daysOverdue > 0) return 'yellow'; 
    return 'green';
  } catch (error) {
    console.error('Error getting status color:', error);
    return 'gray';
  }
};

export const formatLastInvoiceDate = (dateValue) => {
  if (!dateValue) return 'Keine Abrechnung';
  
  try {
    // Handle the new object format
    if (typeof dateValue === 'object' && dateValue !== null) {
      if (dateValue.display) {
        // Extract just the date part (DD.MM.YYYY)
        const datePart = dateValue.display.split(',')[0].trim();
        // Parse the date to ensure it's valid
        const [day, month, year] = datePart.split('.').map(Number);
        const date = new Date(year, month - 1, day);
        
        // If we couldn't parse the date, return the original date part
        if (isNaN(date.getTime())) return datePart;
        
        // Format the date in German format (DD.MM.YYYY)
        return date.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
      return 'Ungültiges Datum';
    }
    
    // Handle the old string format (backward compatibility)
    if (typeof dateValue === 'string') {
      // Extract just the date part (DD.MM.YYYY)
      const datePart = dateValue.split(',')[0].trim();
      // Parse the date to ensure it's valid
      const [day, month, year] = datePart.split('.').map(Number);
      const date = new Date(year, month - 1, day);
      
      // If we couldn't parse the date, return the original date part
      if (isNaN(date.getTime())) return datePart;
      
      // Format the date in German format (DD.MM.YYYY)
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    
    return 'Ungültiges Datum';
  } catch (error) {
    console.error('Error formatting date:', error);
    // If anything fails, try to return just the date part
    if (typeof dateValue === 'string') {
      return dateValue.split(',')[0].trim();
    } else if (dateValue?.display) {
      return dateValue.display.split(',')[0].trim();
    }
    return 'Ungültiges Datum';
  }
};

export const getStatusText = (insurer, currentDate = null) => {
  if (!insurer?.turnus || !insurer?.last_invoice) return ''
  
  const daysOverdue = calculateDaysOverdue(insurer, currentDate)
  
  // Still within turnus period
  if (daysOverdue === 0) {
    return 'Abrechnung OK'
  }
  
  // For 1-5 days overdue
  if (daysOverdue > 0 && daysOverdue <= 5) {
    return `Überfällig (${daysOverdue} Tage)`
  }
  
  // For more than 5 days overdue
  if (daysOverdue > 5) {
    return `Überfällig (>5 Tage)`
  }
  
  return ''
}

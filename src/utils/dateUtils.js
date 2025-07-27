// Utility functions for date calculations

export const isOverdue = (insurer) => {
  if (!insurer || !insurer.last_invoice) return false;
  
  // If the insurer has an overdue flag, use that
  if (insurer.isOverdue !== undefined) return insurer.isOverdue;
  
  // Otherwise, calculate based on the last invoice date
  const lastInvoiceDate = new Date(insurer.last_invoice);
  if (isNaN(lastInvoiceDate.getTime())) return false;
  
  const today = new Date();
  const daysDiff = Math.floor((today - lastInvoiceDate) / (1000 * 60 * 60 * 24));
  
  // Consider an invoice overdue if it's been more than 30 days
  return daysDiff > 30;
};

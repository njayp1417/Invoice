// Invoice Template Script
class InvoiceRenderer {
    constructor() {
        this.loadInvoiceData();
    }

    loadInvoiceData() {
        let invoiceData = null;
        
        // Try to get data from URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const urlData = urlParams.get('data');
        
        if (urlData) {
            try {
                invoiceData = JSON.parse(decodeURIComponent(urlData));
            } catch (e) {
                console.log('Failed to parse URL data');
            }
        }
        
        // Fallback to sessionStorage
        if (!invoiceData) {
            const sessionData = sessionStorage.getItem('invoiceData');
            if (sessionData) {
                try {
                    invoiceData = JSON.parse(sessionData);
                } catch (e) {
                    console.log('Failed to parse session data');
                }
            }
        }
        
        // Fallback to localStorage
        if (!invoiceData) {
            const localData = localStorage.getItem('invoiceData');
            if (localData) {
                try {
                    invoiceData = JSON.parse(localData);
                } catch (e) {
                    console.log('Failed to parse local data');
                }
            }
        }
        
        if (invoiceData) {
            this.renderInvoice(invoiceData);
        } else {
            // Default data for testing
            const defaultData = {
                brand: {
                    name: "KELSA RENTAL",
                    logoUrl: ""
                },
                invoice: {
                    title: "INVOICE",
                    customerName: "Jessica Adagnai",
                    currency: "NGN",
                    currencySymbol: "₦",
                    items: [
                        { description: "Chiavari Chairs", qty: 200, unitCost: 1000, amount: 50000 },
                        { description: "Banquet Circle Table", qty: null, unitCost: null, amount: null },
                        { description: "Banquet Rectangular Table", qty: null, unitCost: null, amount: null },
                        { description: "Plastic Chairs", qty: null, unitCost: null, amount: null },
                        { description: "Plastic Tables", qty: null, unitCost: null, amount: null },
                        { description: "Glass Cup", qty: null, unitCost: null, amount: null },
                        { description: "Wine Cup", qty: null, unitCost: null, amount: null },
                        { description: "Champagne Cup", qty: null, unitCost: null, amount: null },
                        { description: "Saki Pot & Spoon", qty: null, unitCost: null, amount: null },
                        { description: "Cutleries", qty: null, unitCost: null, amount: null },
                        { description: "Carpet Rug", qty: null, unitCost: null, amount: null },
                        { description: "Breakable Plate", qty: null, unitCost: null, amount: null }
                    ],
                    tax: 0,
                    balance: 145000,
                    total: 200000
                },
                contact: {
                    phone: "09134636775",
                    email: "kelsarentalsevent@gmail.com",
                    addressLines: [
                        "Shop B2 Beaufort Court Estate Lugbe",
                        "Abuja."
                    ]
                }
            };
            this.renderInvoice(defaultData);
        }
    }

    renderInvoice(data) {
        // Update customer name
        document.getElementById('customerName').textContent = data.invoice.customerName;

        // Render items table
        this.renderItemsTable(data.invoice.items, data.invoice.currencySymbol);

        // Update summary
        this.renderSummary(data.invoice, data.invoice.currencySymbol);
    }

    renderItemsTable(items, currencySymbol) {
        const tbody = document.getElementById('itemsTableBody');
        tbody.innerHTML = '';

        items.forEach(item => {
            const row = document.createElement('tr');
            
            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = item.description;
            
            const qtyCell = document.createElement('td');
            qtyCell.textContent = item.qty !== null ? item.qty : '';
            qtyCell.style.textAlign = 'center';
            
            const costCell = document.createElement('td');
            costCell.textContent = item.unitCost !== null ? 
                this.formatCurrency(item.unitCost, currencySymbol) : '';
            
            const amountCell = document.createElement('td');
            amountCell.textContent = item.amount !== null ? 
                this.formatCurrency(item.amount, currencySymbol) : '';

            row.appendChild(descriptionCell);
            row.appendChild(qtyCell);
            row.appendChild(costCell);
            row.appendChild(amountCell);
            
            tbody.appendChild(row);
        });
    }

    renderSummary(invoice, currencySymbol) {
        document.getElementById('taxAmount').textContent = 
            this.formatCurrency(invoice.tax, currencySymbol);
        
        document.getElementById('balanceAmount').textContent = 
            this.formatCurrency(invoice.balance, currencySymbol);
        
        document.getElementById('totalAmount').textContent = 
            this.formatCurrency(invoice.total, currencySymbol);
    }

    formatCurrency(amount, symbol = '₦') {
        if (amount === 0) return `${symbol}0`;
        return `${symbol}${amount.toLocaleString()}`;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InvoiceRenderer();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            window.print();
        }
        if (e.key === 'Escape') {
            window.close();
        }
    });
});

// Download PDF functionality
function downloadPDF() {
    const customerName = document.getElementById('customerName').textContent;
    const filename = `Kelsa_Invoice_${customerName.replace(/\s+/g, '_')}.pdf`;
    
    // Hide print controls during PDF generation
    const printControls = document.querySelector('.print-controls');
    printControls.style.display = 'none';
    
    // Use browser's built-in print to PDF
    const originalTitle = document.title;
    document.title = filename;
    
    // Create a temporary print stylesheet
    const printStyle = document.createElement('style');
    printStyle.textContent = `
        @media print {
            @page { margin: 0.5in; }
            body { transform: scale(0.8); transform-origin: top left; }
        }
    `;
    document.head.appendChild(printStyle);
    
    // Trigger print dialog
    window.print();
    
    // Cleanup
    setTimeout(() => {
        printControls.style.display = 'flex';
        document.title = originalTitle;
        document.head.removeChild(printStyle);
    }, 1000);
}

// Print functionality
window.addEventListener('beforeprint', () => {
    document.title = `Invoice - ${document.getElementById('customerName').textContent}`;
});

window.addEventListener('afterprint', () => {
    document.title = 'Kelsa Rental Invoice';
});
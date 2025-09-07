// Invoice Template Script
class InvoiceRenderer {
    constructor() {
        this.loadInvoiceData();
    }

    loadInvoiceData() {
        const data = localStorage.getItem('invoiceData');
        if (data) {
            const invoiceData = JSON.parse(data);
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

// Print functionality
window.addEventListener('beforeprint', () => {
    document.title = `Invoice - ${document.getElementById('customerName').textContent}`;
});

window.addEventListener('afterprint', () => {
    document.title = 'Invoice - Kelsa Events';
});
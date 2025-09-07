// Invoice Form Handler
class InvoiceManager {
    constructor() {
        this.initializeEventListeners();
        this.addInitialItems();
    }

    initializeEventListeners() {
        const form = document.getElementById('invoiceForm');
        const addItemBtn = document.getElementById('addItem');
        const previewBtn = document.getElementById('previewBtn');

        form.addEventListener('submit', (e) => this.handleSubmit(e));
        addItemBtn.addEventListener('click', () => this.addItem());
        previewBtn.addEventListener('click', () => this.previewInvoice());

        // Auto-calculate amounts
        document.addEventListener('input', (e) => {
            if (e.target.name === 'qty' || e.target.name === 'unitCost') {
                this.calculateRowAmount(e.target);
            }
            if (e.target.name === 'tax' || e.target.name === 'balance') {
                this.calculateTotal();
            }
        });

        // Remove item functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item')) {
                this.removeItem(e.target);
            }
        });
    }

    addInitialItems() {
        const defaultItems = [
            'Chiavari Chairs',
            'Banquet Circle Table',
            'Banquet Rectangular Table',
            'Plastic Chairs (Dozens)',
            'Plastic Tables',
            'Glass Cup',
            'Wine Cup',
            'Champagne Cup',
            'Saki Pot & Spoon',
            'Cutleries',
            'Carpet Rug',
            'Breakable Plate'
        ];

        defaultItems.forEach((item, index) => {
            if (index > 0) this.addItem();
            const rows = document.querySelectorAll('.item-row');
            const lastRow = rows[rows.length - 1];
            lastRow.querySelector('input[name="description"]').value = item;
        });
    }

    addItem() {
        const container = document.getElementById('itemsContainer');
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        itemRow.innerHTML = `
            <div class="form-group">
                <label>Description</label>
                <input type="text" name="description" placeholder="Item description">
            </div>
            <div class="form-group">
                <label>Qty</label>
                <input type="number" name="qty" placeholder="0">
            </div>
            <div class="form-group">
                <label>Unit Cost (₦)</label>
                <input type="number" name="unitCost" placeholder="0">
            </div>
            <div class="form-group">
                <label>Amount (₦)</label>
                <input type="number" name="amount" placeholder="0" readonly>
            </div>
            <button type="button" class="remove-item">×</button>
        `;
        container.appendChild(itemRow);
    }

    removeItem(button) {
        const itemRow = button.closest('.item-row');
        const container = document.getElementById('itemsContainer');
        if (container.children.length > 1) {
            itemRow.remove();
            this.calculateTotal();
        }
    }

    calculateRowAmount(input) {
        const row = input.closest('.item-row');
        const qty = parseFloat(row.querySelector('input[name="qty"]').value) || 0;
        const unitCost = parseFloat(row.querySelector('input[name="unitCost"]').value) || 0;
        const amountField = row.querySelector('input[name="amount"]');
        
        const amount = qty * unitCost;
        amountField.value = amount > 0 ? amount : '';
        
        this.calculateTotal();
    }

    calculateTotal() {
        const amounts = Array.from(document.querySelectorAll('input[name="amount"]'))
            .map(input => parseFloat(input.value) || 0);
        
        const subtotal = amounts.reduce((sum, amount) => sum + amount, 0);
        const tax = parseFloat(document.getElementById('tax').value) || 0;
        const balance = parseFloat(document.getElementById('balance').value) || 0;
        
        const total = subtotal + tax + balance;
        document.getElementById('total').value = total;
    }

    formatCurrency(amount) {
        return `₦${amount.toLocaleString()}`;
    }

    collectFormData() {
        const customerName = document.getElementById('customerName').value;
        const tax = parseFloat(document.getElementById('tax').value) || 0;
        const balance = parseFloat(document.getElementById('balance').value) || 0;
        const total = parseFloat(document.getElementById('total').value) || 0;

        const items = Array.from(document.querySelectorAll('.item-row')).map(row => {
            const description = row.querySelector('input[name="description"]').value;
            const qty = parseFloat(row.querySelector('input[name="qty"]').value) || null;
            const unitCost = parseFloat(row.querySelector('input[name="unitCost"]').value) || null;
            const amount = parseFloat(row.querySelector('input[name="amount"]').value) || null;

            return { description, qty, unitCost, amount };
        }).filter(item => item.description.trim() !== '');

        return {
            brand: {
                name: "KELSA RENTAL",
                logoUrl: ""
            },
            invoice: {
                title: "INVOICE",
                customerName,
                currency: "NGN",
                currencySymbol: "₦",
                items,
                tax,
                balance,
                total
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
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = this.collectFormData();
        
        if (!data.invoice.customerName.trim()) {
            alert('Please enter customer name');
            return;
        }

        if (data.invoice.items.length === 0) {
            alert('Please add at least one item');
            return;
        }

        this.generateInvoice(data);
    }

    previewInvoice() {
        const data = this.collectFormData();
        
        if (!data.invoice.customerName.trim()) {
            alert('Please enter customer name to preview');
            return;
        }

        this.generateInvoice(data, true);
    }

    generateInvoice(data, isPreview = false) {
        // Store data in localStorage for the invoice page
        localStorage.setItem('invoiceData', JSON.stringify(data));
        
        // Open invoice in new window/tab
        const invoiceWindow = window.open('invoice.html', '_blank');
        
        if (!invoiceWindow) {
            alert('Please allow popups to generate the invoice');
        }
    }
}

// Initialize the invoice manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InvoiceManager();
});
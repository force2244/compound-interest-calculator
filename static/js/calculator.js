/**
 * Compound Interest Calculator
 * Handles form interactions, field enabling/disabling, and calculations
 */

class CompoundInterestCalculator {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.initializeDefaultState();
    }

    initializeElements() {
        // Form elements
        this.form = document.getElementById('calculatorForm');
        this.radioButtons = document.querySelectorAll('input[name="calculateField"]');
        
        // Input fields
        this.principalInput = document.getElementById('principal');
        this.rateInput = document.getElementById('rate');
        this.yearsInput = document.getElementById('years');
        this.futureValueInput = document.getElementById('futureValue');
        
        // Alert elements
        this.errorAlert = document.getElementById('errorAlert');
        this.successAlert = document.getElementById('successAlert');
        this.errorMessage = document.getElementById('errorMessage');
        
        // Field mapping for easy access
        this.fieldMap = {
            'principal': this.principalInput,
            'rate': this.rateInput,
            'years': this.yearsInput,
            'futureValue': this.futureValueInput
        };
    }

    attachEventListeners() {
        // Radio button change events
        this.radioButtons.forEach(radio => {
            radio.addEventListener('change', () => this.handleRadioChange());
        });

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Input field changes for real-time validation
        Object.values(this.fieldMap).forEach(input => {
            input.addEventListener('input', () => this.clearAlerts());
        });
    }

    initializeDefaultState() {
        // Set default radio selection to Future Value
        document.getElementById('calculateFutureValue').checked = true;
        this.handleRadioChange();
    }

    handleRadioChange() {
        // Clear previous alerts
        this.clearAlerts();
        
        // Get selected field to calculate
        const selectedField = document.querySelector('input[name="calculateField"]:checked')?.value;
        
        if (!selectedField) return;

        // Enable all fields first
        Object.values(this.fieldMap).forEach(input => {
            input.disabled = false;
            input.classList.remove('bg-light');
        });

        // Disable and style the selected field
        const selectedInput = this.fieldMap[selectedField];
        if (selectedInput) {
            selectedInput.disabled = true;
            selectedInput.classList.add('bg-light');
            // Don't clear the field value - keep calculated results visible
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const selectedField = document.querySelector('input[name="calculateField"]:checked')?.value;
        if (!selectedField) {
            this.showError('Please select a field to calculate.');
            return;
        }

        // Get input values
        const values = this.getInputValues(selectedField);
        if (!values) return; // Validation failed

        // Perform calculation
        const result = this.calculate(selectedField, values);
        if (result !== null) {
            this.displayResult(selectedField, result);
            this.showSuccess();
        }
    }

    getInputValues(excludeField) {
        const values = {};
        
        // Get all field values except the one being calculated
        for (const [fieldName, input] of Object.entries(this.fieldMap)) {
            if (fieldName === excludeField) continue;
            
            const value = parseFloat(input.value);
            
            if (!input.value || isNaN(value) || value < 0) {
                this.showError(`Please enter a valid positive number for ${this.getFieldDisplayName(fieldName)}.`);
                return null;
            }
            
            values[fieldName] = value;
        }

        // Additional validation
        if (!this.validateInputs(excludeField, values)) {
            return null;
        }

        return values;
    }

    validateInputs(excludeField, values) {
        // Convert rate from percentage to decimal for calculations
        if (values.rate !== undefined) {
            if (values.rate > 100) {
                this.showError('Interest rate seems too high. Please enter a reasonable annual percentage rate.');
                return false;
            }
            values.rate = values.rate / 100; // Convert percentage to decimal
        }

        // Validate years
        if (values.years !== undefined && values.years <= 0) {
            this.showError('Years must be greater than 0.');
            return false;
        }

        // Validate principal and future value relationship for rate/time calculations
        if (excludeField === 'rate' || excludeField === 'years') {
            if (values.futureValue <= values.principal) {
                this.showError('Future Value must be greater than Principal for meaningful calculations.');
                return false;
            }
        }

        return true;
    }

    calculate(field, values) {
        try {
            let result;

            switch (field) {
                case 'futureValue':
                    // FV = P × (1 + r)^t
                    result = values.principal * Math.pow(1 + values.rate, values.years);
                    break;

                case 'principal':
                    // P = FV / (1 + r)^t
                    result = values.futureValue / Math.pow(1 + values.rate, values.years);
                    break;

                case 'rate':
                    // r = (FV / P)^(1/t) - 1
                    result = Math.pow(values.futureValue / values.principal, 1 / values.years) - 1;
                    result = result * 100; // Convert to percentage
                    break;

                case 'years':
                    // t = log(FV / P) / log(1 + r)
                    if (values.rate <= 0) {
                        this.showError('Interest rate must be greater than 0 for time calculations.');
                        return null;
                    }
                    result = Math.log(values.futureValue / values.principal) / Math.log(1 + values.rate);
                    break;

                default:
                    this.showError('Invalid calculation field selected.');
                    return null;
            }

            // Check for invalid results
            if (!isFinite(result) || isNaN(result) || result < 0) {
                this.showError('Calculation resulted in an invalid value. Please check your inputs.');
                return null;
            }

            return result;

        } catch (error) {
            console.error('Calculation error:', error);
            this.showError('An error occurred during calculation. Please check your inputs.');
            return null;
        }
    }

    displayResult(field, result) {
        const input = this.fieldMap[field];
        if (input) {
            // Round based on field type
            if (field === 'principal' || field === 'futureValue') {
                input.value = Math.round(result).toString(); // No decimal places for monetary values
            } else if (field === 'rate') {
                input.value = result.toFixed(2); // 2 decimal places for percentage
            } else if (field === 'years') {
                input.value = result.toFixed(1); // 1 decimal place for years
            }
            
            // Add visual feedback but keep value visible
            input.classList.add('fw-bold', 'text-success');
            setTimeout(() => {
                input.classList.remove('fw-bold', 'text-success');
            }, 2000);
        }
    }

    getFieldDisplayName(fieldName) {
        const displayNames = {
            'principal': 'Starting Principal',
            'rate': 'Interest Rate',
            'years': 'Years to Grow',
            'futureValue': 'Future Value'
        };
        return displayNames[fieldName] || fieldName;
    }

    showError(message) {
        this.clearAlerts();
        this.errorMessage.textContent = message;
        this.errorAlert.classList.remove('d-none');
        this.errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    showSuccess() {
        this.clearAlerts();
        this.successAlert.classList.remove('d-none');
        setTimeout(() => {
            this.successAlert.classList.add('d-none');
        }, 3000);
    }

    clearAlerts() {
        this.errorAlert.classList.add('d-none');
        this.successAlert.classList.add('d-none');
    }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CompoundInterestCalculator();
});

// Add some utility functions for enhanced user experience
document.addEventListener('DOMContentLoaded', () => {
    // Format number inputs on blur for better UX
    const numberInputs = document.querySelectorAll('input[type="number"]');
    
    numberInputs.forEach(input => {
        input.addEventListener('blur', (e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value >= 0) {
                // Format monetary values with 2 decimal places
                if (e.target.id === 'principal' || e.target.id === 'futureValue') {
                    e.target.value = value.toFixed(2);
                }
                // Format rate with 2 decimal places
                else if (e.target.id === 'rate') {
                    e.target.value = value.toFixed(2);
                }
                // Format years with 1 decimal place
                else if (e.target.id === 'years') {
                    e.target.value = value.toFixed(1);
                }
            }
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Enter key to calculate (when not focused on submit button)
        if (e.key === 'Enter' && e.target.type !== 'submit') {
            e.preventDefault();
            document.querySelector('button[type="submit"]').click();
        }
        
        // Escape key to clear all fields
        if (e.key === 'Escape') {
            e.preventDefault();
            numberInputs.forEach(input => input.value = '');
            document.querySelector('.alert:not(.d-none)')?.classList.add('d-none');
        }
    });
});

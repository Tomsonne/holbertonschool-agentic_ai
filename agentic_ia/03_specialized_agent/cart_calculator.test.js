const { calculateTotal } = require('./src/cart_calculator');

describe('calculateTotal', () => {
    test('should_return_zero_when_items_are_not_an_array', () => {
        // Arrange
        const items = 'invalid cart';

        // Act
        const total = calculateTotal(items);

        // Assert
        expect(total).toBe(0);
    });

    test('should_return_zero_when_cart_is_empty', () => {
        // Arrange
        const items = [];

        // Act
        const total = calculateTotal(items);

        // Assert
        expect(total).toBe(0);
    });

    test('should_apply_default_quantity_when_quantity_is_missing', () => {
        // Arrange
        const items = [{ price: 10 }];

        // Act
        const total = calculateTotal(items, 0);

        // Assert
        expect(total).toBe(10);
    });

    test('should_apply_default_tax_rate_when_tax_rate_is_omitted', () => {
        // Arrange
        const items = [{ price: 10, quantity: 2 }];

        // Act
        const total = calculateTotal(items);

        // Assert
        expect(total).toBe(24);
    });

    test('should_calculate_subtotal_when_cart_contains_multiple_items', () => {
        // Arrange
        const items = [
            { price: 10, quantity: 2 },
            { price: 5, quantity: 3 },
        ];

        // Act
        const total = calculateTotal(items, 0);

        // Assert
        expect(total).toBe(35);
    });

    test('should_apply_custom_tax_rate_when_tax_rate_is_provided', () => {
        // Arrange
        const items = [{ price: 100, quantity: 1 }];

        // Act
        const total = calculateTotal(items, 0.055);

        // Assert
        expect(total).toBe(105.5);
    });

    test('should_subtract_fixed_discount_when_discount_is_applied', () => {
        // Arrange
        const items = [{ price: 100, quantity: 1 }];

        // Act
        const total = calculateTotal(items, 0.2, 10);

        // Assert
        expect(total).toBe(108);
    });

    test('should_floor_discounted_subtotal_at_zero_when_discount_exceeds_subtotal', () => {
        // Arrange
        const items = [{ price: 10, quantity: 1 }];

        // Act
        const total = calculateTotal(items, 0.2, 15);

        // Assert
        expect(total).toBe(0);
    });

    test('should_ignore_negative_prices_when_calculating_subtotal', () => {
        // Arrange
        const items = [{ price: -10, quantity: 2 }, { price: 5, quantity: 1 }];

        // Act
        const total = calculateTotal(items, 0);

        // Assert
        expect(total).toBe(5);
    });

    test('should_ignore_negative_quantities_when_calculating_subtotal', () => {
        // Arrange
        const items = [{ price: 10, quantity: -2 }, { price: 5, quantity: 1 }];

        // Act
        const total = calculateTotal(items, 0);

        // Assert
        expect(total).toBe(5);
    });

    test('should_preserve_legacy_default_quantity_when_quantity_is_zero', () => {
        // Arrange
        const items = [{ price: 10, quantity: 0 }];

        // Act
        const total = calculateTotal(items, 0);

        // Assert
        expect(total).toBe(10);
    });

    test('should_use_zero_price_when_price_is_missing', () => {
        // Arrange
        const items = [{ quantity: 3 }];

        // Act
        const total = calculateTotal(items, 0);

        // Assert
        expect(total).toBe(0);
    });

    test('should_round_total_to_two_decimal_places_when_tax_produces_fractional_result', () => {
        // Arrange
        const items = [{ price: 10, quantity: 1 }];

        // Act
        const total = calculateTotal(items, 0.3336);

        // Assert
        expect(total).toBe(13.34);
    });
});
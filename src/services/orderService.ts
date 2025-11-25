import type { EnrichedOrder, Order, CartItem } from '@/types';
import axios from 'axios';

export async function getUserOrders(userId: string): Promise<EnrichedOrder[]> {
    try {
        const response = await axios.get(`/api/orders?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw new Error('Failed to fetch user orders');
    }
}

export async function cancelOrder(orderId: string, userId: string): Promise<void> {
    try {
        await axios.patch(`/api/orders/${orderId}`, {
            userId,
            status: 'cancelled'
        });
    } catch (error) {
        console.error('Error canceling order:', error);
        throw new Error('Failed to cancel order');
    }
}

export async function placeOrderWithStockUpdate(
    orderData: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'order_date' | 'status' | 'notes'>,
    cartItems: CartItem[]
): Promise<{ success: boolean; orderId: number }> {
    try {
        const response = await axios.post('/api/orders', {
            orderData,
            cartItems
        });
        return response.data;
    } catch (error: any) {
        console.error('Error placing order:', error);
        throw new Error(error.response?.data?.error || 'Failed to place order');
    }
}

export type { EnrichedOrder };


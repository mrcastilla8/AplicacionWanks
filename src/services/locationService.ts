import { StoreLocation, TimeSlot } from '@/types';
import { timeSlots } from '@/data/stores';
import axios from 'axios';

export const getStoreLocations = async (): Promise<StoreLocation[]> => {
    try {
        const response = await axios.get('/api/locations');
        return response.data;
    } catch (error) {
        console.error('Error fetching store locations:', error);
        return [];
    }
};

export const getAvailableTimeSlots = async (): Promise<TimeSlot[]> => {
    // In a real app, this might check availability against a backend
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(timeSlots);
        }, 500);
    });
};

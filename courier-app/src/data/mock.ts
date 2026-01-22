export interface Task {
    id: string;
    type: 'pickup' | 'delivery';
    status: 'pending' | 'accepted' | 'pickup_arrived' | 'picked_up' | 'delivery_arrived' | 'delivered' | 'cancelled';
    pickup: {
        address: string;
        contactParams: string;
        deadline?: string;
    };
    delivery: {
        address: string;
        contactParams: string;
        notes?: string;
        deadline?: string;
    };
    payout: number;
    distance: string;
}

export const MOCK_TASKS: Task[] = [
    {
        id: 'T-1001',
        type: 'delivery',
        status: 'pending',
        pickup: {
            address: '123 Tech Park, Logistics Hub',
            contactParams: '+1234567890'
        },
        delivery: {
            address: '45 Green St, Downtown',
            contactParams: '+1987654321',
            notes: 'Leave at front desk'
        },
        payout: 12.50,
        distance: '3.2 km'
    }
];

export const COURIER_PROFILE = {
    id: 'CID-8821',
    name: 'Alex Rider',
    vehicle: 'E-Bike',
    rating: 4.8,
    totalDeliveries: 1240
};

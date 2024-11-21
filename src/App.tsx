import { useState } from 'react';
import { format } from 'date-fns';
import { Toaster } from '@/components/ui/toaster';
import { FlightSearch } from '@/components/FlightSearch';
import { PriceCalendar } from '@/components/PriceCalendar';
import { getFlightPrices, type FlightPrice } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function App() {
  const [prices, setPrices] = useState<FlightPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async ({
    origin,
    destination,
    date,
  }: {
    origin: string;
    destination: string;
    date: Date;
  }) => {
    try {
      setLoading(true);
      const response = await getFlightPrices(
        origin,
        destination,
        format(date, 'yyyy-MM-dd')
      );
      setPrices(response.data.flights.days);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch flight prices. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          Flight Price Calendar
        </h1>
        <FlightSearch onSearch={handleSearch} />
        <PriceCalendar prices={prices} loading={loading} />
      </div>
      <Toaster />
    </div>
  );
}
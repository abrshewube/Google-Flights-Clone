import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plane, PlaneLanding, PlaneTakeoff } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { AIRPORTS, isValidAirportCode } from '@/lib/airports';

interface FlightSearchProps {
  onSearch: (data: {
    origin: string;
    destination: string;
    date: Date;
  }) => void;
}

export function FlightSearch({ onSearch }: FlightSearchProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();

  const validateAndSearch = () => {
    if (!origin || !destination || !date) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields before searching.',
        variant: 'destructive',
      });
      return;
    }

    const upperOrigin = origin.toUpperCase();
    const upperDestination = destination.toUpperCase();

    if (!isValidAirportCode(upperOrigin)) {
      toast({
        title: 'Invalid Origin',
        description: 'Please enter a valid origin airport code.',
        variant: 'destructive',
      });
      return;
    }

    if (!isValidAirportCode(upperDestination)) {
      toast({
        title: 'Invalid Destination',
        description: 'Please enter a valid destination airport code.',
        variant: 'destructive',
      });
      return;
    }

    if (upperOrigin === upperDestination) {
      toast({
        title: 'Invalid Route',
        description: 'Origin and destination cannot be the same.',
        variant: 'destructive',
      });
      return;
    }

    onSearch({
      origin: upperOrigin,
      destination: upperDestination,
      date,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="origin">From</Label>
          <Select
            value={origin}
            onValueChange={setOrigin}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select origin airport" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(AIRPORTS).map(([code, name]) => (
                <SelectItem key={code} value={code}>
                  {code} - {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination">To</Label>
          <Select
            value={destination}
            onValueChange={setDestination}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select destination airport" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(AIRPORTS).map(([code, name]) => (
                <SelectItem key={code} value={code}>
                  {code} - {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Departure Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-6"
      >
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={validateAndSearch}
        >
          <Plane className="mr-2 h-4 w-4" />
          Search Flights
        </Button>
      </motion.div>
    </motion.div>
  );
}
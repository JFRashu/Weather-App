import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const CalendarBox = ({ title, currentDate, month, year, days = 30 }) => {
    const firstDayOfMonth = new Date(year, new Date().getMonth(), 1).getDay();
    
    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-sky-400" />
                <h3 className="text-xl font-semibold text-white">{title}</h3>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-white/80 p-1">
                        {day}
                    </div>
                ))}
                
                {/* Calendar days */}
                {Array(42).fill(null).map((_, index) => {
                    const dayNumber = index - firstDayOfMonth + 1;
                    const isCurrentDay = dayNumber === currentDate;
                    const isValidDay = dayNumber > 0 && dayNumber <= days;
                    
                    return (
                        <div
                            key={index}
                            className={`
                                text-center p-1 rounded-md
                                ${isValidDay ? 'text-white' : 'opacity-0'}
                                ${isCurrentDay ? 'bg-sky-500 font-bold' : 'hover:bg-white/10'}
                            `}
                        >
                            {isValidDay ? dayNumber : ''}
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-4 text-center text-white">
                <span className="font-medium">{month} {year}</span>
            </div>
        </div>
    );
};

export const CalendarBoxes = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [dates, setDates] = useState({
        gregorian: {
            date: 1,
            month: '',
            year: 2024
        },
      
    });

    // Update dates
    useEffect(() => {
        const updateDates = () => {
            const now = new Date();
            
            // Gregorian date
            setDates(prev => ({
                ...prev,
                gregorian: {
                    date: now.getDate(),
                    month: now.toLocaleString('default', { month: 'long' }),
                    year: now.getFullYear()
                },
               
            }));
        };

        updateDates();
        const intervalId = setInterval(updateDates, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 flex justify-center ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CalendarBox 
                    title="Gregorian Calendar"
                    currentDate={dates.gregorian.date}
                    month={dates.gregorian.month}
                    year={dates.gregorian.year}
                />
                
            </div>
        </div>
    );
};
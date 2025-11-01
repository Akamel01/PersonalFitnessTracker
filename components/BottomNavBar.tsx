import React from 'react';
import { View } from '../types';

interface BottomNavBarProps {
    currentView: View;
    setCurrentView: (view: View) => void;
}

const navItems = [
    { view: View.LOG, icon: 'fa-solid fa-plus', label: 'Log' },
    { view: View.HISTORY, icon: 'fa-solid fa-history', label: 'History' },
    { view: View.DASHBOARD, icon: 'fa-solid fa-chart-line', label: 'Dashboard' },
    { view: View.PLANS, icon: 'fa-solid fa-clipboard-list', label: 'Plans' },
    { view: View.WEIGHT, icon: 'fa-solid fa-weight-scale', label: 'Weight' },
    { view: View.TIP, icon: 'fa-solid fa-lightbulb', label: 'AI Tip' },
];

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, setCurrentView }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-lg z-50">
            <div className="max-w-4xl mx-auto flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <button
                        key={item.view}
                        onClick={() => setCurrentView(item.view)}
                        className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200
                            ${currentView === item.view ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}
                        `}
                    >
                        <i className={`${item.icon} text-xl`}></i>
                        <span className="text-xs mt-1">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

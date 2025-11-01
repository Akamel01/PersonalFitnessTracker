
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 shadow-md">
            <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <i className="fa-solid fa-chart-line text-indigo-400 text-3xl mr-3"></i>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Zenith Fitness
                </h1>
            </div>
        </header>
    );
};

export default Header;

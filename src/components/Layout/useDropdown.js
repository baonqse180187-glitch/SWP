import { useState, useRef, useEffect } from 'react';

export const useDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, right: 0 });
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                buttonRef.current && !buttonRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updatePosition = (isBottom = false) => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            if (isBottom) {
                setPosition({
                    bottom: window.innerHeight - rect.top + 12,
                    left: rect.left
                });
            } else {
                setPosition({
                    top: rect.bottom + 8,
                    right: window.innerWidth - rect.right
                });
            }
        }
    };

    return { isOpen, setIsOpen, position, dropdownRef, buttonRef, updatePosition };
};

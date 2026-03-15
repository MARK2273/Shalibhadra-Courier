import React, { createContext, useContext, useState, useEffect } from 'react';

interface OwnerModeContextType {
  isOwnerMode: boolean;
  setOwnerMode: (value: boolean) => void;
  logoutOwnerMode: () => void;
}

const OwnerModeContext = createContext<OwnerModeContextType | undefined>(undefined);

export const OwnerModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOwnerMode, setIsOwnerMode] = useState<boolean>(() => {
    return localStorage.getItem('isOwnerMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isOwnerMode', isOwnerMode.toString());
  }, [isOwnerMode]);

  const logoutOwnerMode = () => {
    setIsOwnerMode(false);
    localStorage.removeItem('isOwnerMode');
  };

  return (
    <OwnerModeContext.Provider value={{ isOwnerMode, setOwnerMode: setIsOwnerMode, logoutOwnerMode }}>
      {children}
    </OwnerModeContext.Provider>
  );
};

export const useOwnerMode = () => {
  const context = useContext(OwnerModeContext);
  if (context === undefined) {
    throw new Error('useOwnerMode must be used within an OwnerModeProvider');
  }
  return context;
};

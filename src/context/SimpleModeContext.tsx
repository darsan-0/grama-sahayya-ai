import React, { createContext, useContext, useState, useEffect } from 'react';

interface SimpleModeContextType {
  isSimpleMode: boolean;
  toggleSimpleMode: () => void;
  setSimpleMode: (enabled: boolean) => void;
}

const SimpleModeContext = createContext<SimpleModeContextType | undefined>(undefined);

export const SimpleModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSimpleMode, setIsSimpleModeState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gs_simple_mode') === 'true';
    }
    return false;
  });

  const setSimpleMode = (enabled: boolean) => {
    setIsSimpleModeState(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gs_simple_mode', String(enabled));
    }
  };

  const toggleSimpleMode = () => {
    setSimpleMode(!isSimpleMode);
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isSimpleMode) {
        document.documentElement.classList.add('simple-mode');
      } else {
        document.documentElement.classList.remove('simple-mode');
      }
    }
  }, [isSimpleMode]);

  return (
    <SimpleModeContext.Provider value={{ isSimpleMode, toggleSimpleMode, setSimpleMode }}>
      {children}
    </SimpleModeContext.Provider>
  );
};

export const useSimpleMode = () => {
  const context = useContext(SimpleModeContext);
  if (!context) throw new Error('useSimpleMode must be used within SimpleModeProvider');
  return context;
};

import { createContext, useContext, useState, ReactNode } from 'react';
import { ProcessInputMode, ProcessResult } from '@workspace/api-client-react';

interface AppContextType {
  selectedMode: ProcessInputMode;
  setSelectedMode: (mode: ProcessInputMode) => void;
  inputType: 'talk' | 'type' | null;
  setInputType: (type: 'talk' | 'type' | null) => void;
  currentResult: ProcessResult | null;
  setCurrentResult: (result: ProcessResult | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedMode, setSelectedMode] = useState<ProcessInputMode>('ai_recommended');
  const [inputType, setInputType] = useState<'talk' | 'type' | null>(null);
  const [currentResult, setCurrentResult] = useState<ProcessResult | null>(null);

  return (
    <AppContext.Provider value={{ selectedMode, setSelectedMode, inputType, setInputType, currentResult, setCurrentResult }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

import React, { createContext, useContext, useState } from 'react';

// Define the shape of the context
interface ErrorLoggerContext {
  logError: (error: Error) => void;
}

// Create a context for error logging
const ErrorLoggerContext = createContext<ErrorLoggerContext | undefined>(undefined);

// ErrorLogger component to wrap your app or specific parts where error logging is needed
export const ErrorLogger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [, setErrors] = useState<Error[]>([]);

  const logError = (error: Error) => {
    console.error('Logged Error:', error);
    setErrors(prevErrors => [...prevErrors, error]);
    // Here you might want to send the error to a server or a logging service
  };

  return (
    <ErrorLoggerContext.Provider value={{ logError }}>
      {children}
    </ErrorLoggerContext.Provider>
  );
};

// Custom hook for using the error logger
export const useErrorLogger = (): ErrorLoggerContext => {
  const context = useContext(ErrorLoggerContext);
  if (context === undefined) {
    throw new Error('useErrorLogger must be used within an ErrorLoggerProvider');
  }
  return context;
};
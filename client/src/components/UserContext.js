import React from "react";

export const CurrentUserContext = React.createContext();

export const CurrentUserProvider = ({ children }) => {
  const usePersistedState = (alternative, saved) => {
    return React.useState(() => {
      const file = localStorage.getItem(saved);
      const initial = JSON.parse(file);
      return initial || alternative;
    });
  };
  const [currentUser, setCurrentUser] = usePersistedState(null, "current-user");

  React.useEffect(() => {
    localStorage.setItem("current-user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <CurrentUserContext.Provider
      value={{
        setCurrentUser,
        currentUser,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

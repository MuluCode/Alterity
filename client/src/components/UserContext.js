import React from "react";

export const CurrentUserContext = React.createContext();

export const CurrentUserProvider = ({ children }) => {
  // pesisted state function that uses current user value stored in local storage if available
  const usePersistedState = (alternative, saved) => {
    return React.useState(() => {
      const file = localStorage.getItem(saved);
      const initial = JSON.parse(file);
      return initial || alternative;
    });
  };
  const [currentUser, setCurrentUser] = usePersistedState(null, "current-user");
  const [unreadMessages, setUnreadMessages] = React.useState(0);

  // function that fetches messages and updates the new message count on inbox icon
  const checkForMessages = () => {
    let unreadNumber = 0;
    if (currentUser) {
      fetch(`/api/messages/${currentUser._id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            let conversations = Object.values(data.data);
            conversations.forEach((conversation) => {
              delete conversation.chart;
              const messages = Object.values(conversation);
              messages.forEach((messageObject) => {
                if (messageObject.status === "Unread") {
                  unreadNumber += 1;
                }
              });
            });
            setUnreadMessages(unreadNumber);
          }
        });
    }
  };
  // save the current user in local storage whenever the values changes
  React.useEffect(() => {
    localStorage.setItem("current-user", JSON.stringify(currentUser));
  }, [currentUser]);

  // check for messages every 5 seconds
  React.useEffect(() => {
    checkForMessages();
    const messageCheck = setInterval(checkForMessages, 5000);
    return () => clearInterval(messageCheck);
  }, [currentUser]);

  return (
    <CurrentUserContext.Provider
      value={{
        setCurrentUser,
        currentUser,
        unreadMessages,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

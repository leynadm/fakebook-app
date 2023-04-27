import React, { createContext, useState } from "react";

interface PostContextType {
  updateKey: number;
  increaseUpdateSequence: () => void;
}

export const PostContext = createContext<PostContextType>({
  updateKey: 0,
  increaseUpdateSequence: () => {},
});

export const PostContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [updateKey, setUpdateKey] = useState(0);

  const increaseUpdateSequence = () => {
    setUpdateKey((prevCount) => prevCount + 1);
  };
  return (
    <PostContext.Provider value={{ updateKey, increaseUpdateSequence }}>
      {children}
    </PostContext.Provider>
  );
};

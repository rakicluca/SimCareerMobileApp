import React, { useState } from "react";

const ChampionshipsContext = React.createContext();

const ChampionshipsProvider = (props) => {
  const [listaCampionati, setListaCampionati] = useState([]);
  const [myListaCampionati, setmyListaCampionati] = useState([]);

  return (
    <ChampionshipsContext.Provider
      value={{
        listaCampionati,
        setListaCampionati,
        myListaCampionati,
        setmyListaCampionati,
      }}
    >
      {props.children}
    </ChampionshipsContext.Provider>
  );
};

export { ChampionshipsContext, ChampionshipsProvider };

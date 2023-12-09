import React, { useState } from 'react'
import { encode } from 'js-base64';
import shuffle from './shuffle';
import { Link } from "react-router-dom";

const FriendEntry = (props) => {
  const { name, friend } = props;
  const code = encode(friend);
  const href = `/project/secret-friend/${code}`;
  return (
    <div className="flex flex-wrap">
      <div className="w-full px-4 flex-1">
        <span className="text-sm block p-3 text-blueGray-700">{name}</span>
      </div>
      <div className="w-full px-4 flex-1">
        <span className="text-sm block p-3 text-blueGray-700">
          <Link 
            to={href}
            className="get-started text-white font-bold px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 bg-orange-500 active:bg-orange-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
          >Secret Friend</Link>
        </span>
      </div>
    </div>
  )
}

const SecretFriendCreate = () => {
  
  const [names, setNames] = useState([]);
  const [friends, setFriends] = useState([])
  const [currentName, setCurrentName] = useState('');

  const handleAddButton = () => {
    const newNameList = [...names, currentName]
    setNames(newNameList);
    setCurrentName('');
    const shuffledNames = shuffle(newNameList);
    setFriends(shuffledNames);
  } 

  return (

    <div className="container mt-24 mb-24 px-4 mx-auto">      
      <div className="mx-auto align-center">
        Secret Friend AP
      </div>
      {names.map((name, key) => <FriendEntry key={name} name={name} friend={friends[key]}/>)}
      <div className="w-full px-4 flex-1">
          <input type="text" placeholder="Regular Input" className="px-3 py-3 placeholder-orange-300 text-orange-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline" value={currentName} onChange={(ev) => {setCurrentName(ev.target.value)}}
          onKeyUp={(ev) => {
            if (ev.key === "Enter") {
              handleAddButton();
            }
          }}  
          />
          <button className="bg-orange-500 text-white active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={handleAddButton}>
            Adicionar
          </button>
        </div>
    </div>
  )
}

export default SecretFriendCreate
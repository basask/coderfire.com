import React from 'react'

import { useParams } from "react-router-dom";
import { encode, decode } from 'js-base64';


const SecretFriend = () => {
  
  const { code } = useParams();
  const message = decode(code);

  return (
    <div className="container mt-24 mb-24 px-4 mx-auto">
      <div className="w-full px-4 flex-1">
        <h4 className="text-2xl font-normal leading-normal mt-0 mb-2 text-orange-800 text-center">
          Seu amigo secreto é:
        </h4>
      </div>

      <div className="w-full px-4 flex-1">
        <h2 className="text-5xl font-normal leading-normal mt-0 mb-2 text-orange-800 text-center">
          {message}
        </h2>
      </div>
    </div>
  )
}


export default SecretFriend
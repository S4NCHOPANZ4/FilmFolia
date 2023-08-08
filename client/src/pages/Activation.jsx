import React, { useEffect, useState } from "react";
import styles from "../styles/styles";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../server";
import axios from "axios";

const Activation = () => {

  const { url } = useParams();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const decodedJwtKey = url.replace(/!/g, '.');
    

        if(decodedJwtKey ){
            const activationEmail = async () =>{
                try {
                    const res = await axios.post(`${server}/user/activation`, {
                        activation_token: decodedJwtKey
                    });
                    navigate('/')
                    console.log(res.data.message);
                    
                }catch (err){
                    console.log(err.response.data.message);
                    setError(true)
                    
                }
      }
          activationEmail();
    }
},[])


  return (
    <div className="h-[100vh] w-[100vw] bg-[#000] flex justify-center items-center flex-col">
      <h1 className="text-white 800px:text-[2rem] font-light">
        Your account has been activated
        
      </h1>
      <p className="text-[#8d8a8ad4] 800px:text-[1rem] font-light">
        you can close this tab
      </p>

    </div>
  );
};

export default Activation;

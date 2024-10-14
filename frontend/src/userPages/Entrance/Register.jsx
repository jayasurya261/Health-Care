import React, { useState } from 'react'
import { images } from '../../assets/images'
import axios from 'axios'
import { Link } from 'react-router-dom'
import HCaptcha from '@hcaptcha/react-hcaptcha';
import Header from '../../components/reuse/general/Header';



const Register = () => {

    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [hcaptchaToken, setCaptchaToken] = useState('');

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
      };

    function register(){
        console.log(name)
        console.log(email)
        console.log(password)
        console.log(hcaptchaToken)

        const data = {
            name,
            email,
            password,
            hcaptchaToken,
        }
        axios.post('http://localhost:3000/user/register',data)
        .then((response)=>{
            console.log("Registered Successfully")
            console.log(response)
        })
        .catch((error)=>{
            console.log(error)
        })
    }



  return (
    <>
    <Header></Header>
    <div className='bg-slate-50'>
        <div className='flex'>
            <div className='ml-[150px] mt-[110px]'>
                <p className='text-[40px] font-medium'>Register To</p>
                <p className='text-[40px] font-medium'>Live Health! Live Happy!</p>

                <div className='mt-10 text-[18px]'>
                    <p>if you have account</p>
                    <Link to='/login'>
                             <p>you can <span className='text-blue-700 font-medium'>Login Here</span></p>
                    </Link>
                </div>
            </div>
            <div>
                <img src={images.boy} alt="" className='w-[600px] mt-[100px] ml-18'/>
            </div>
            <div className='flex flex-col mt-[200px]'>
                <input type="text" placeholder='Enter Name' className='bg-slate-100 mb-10 p-2 w-[300px]' value={name}
          onChange={(e) => setName(e.target.value)}/>
                <input type="text" placeholder='Enter Email' className='bg-slate-100 mb-10 p-2 w-[300px]' value={email}
          onChange={(e) => setEmail(e.target.value)}/>
                <input type="text" placeholder='Enter Password' className='bg-slate-100 mb-10 p-2 w-[300px]' value={password}
          onChange={(e) => setPassword(e.target.value)}/>

<HCaptcha
            sitekey='9398532e-7d12-4e8a-8fb4-4c12b6180caa' // Replace with your hCaptcha site key
            onVerify={handleCaptchaChange}
          />
                <button className='bg-blue-600 text-white pt-1 pb-1 rounded-[10px]' onClick={()=>register()}>Register</button>
            </div>
        </div>
    </div>
    </>
  )
}

export default Register

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
export function Signin(){
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const auth = getAuth()
    const navigate = useNavigate();
    async function handleSignIn(e){
        e.preventDefault();
    signInWithEmailAndPassword(auth,email,password)
    .then((user) => {
        // Success...
        console.log(user)
        navigate('/dashboard')
        //...
    })
    .catch((error) => {
        // Error
        console.log(error)
    })
    }

    return <div className="bg-gray-300 h-screen w-full flex justify-center">
        <div className="flex justify-center h-screen w-max">
           <form  className="flex justify-center flex-col " action="#">
            <div className="bg-white border-2 border-black rounded-lg w-max h-max p-4">      
            <div className="flex justify-center font-medium text-lg">Sign into your account</div>
            <input onChange={(e) => {setEmail(e.target.value)}} type="text" placeholder="Email" className="mt-2 w-full border-2 focus:outline-none focus:ring-1 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-1 me-2 "/>
            <input  onChange={(e) => {setPassword(e.target.value)}} type="password" placeholder="Password" className="mt-2 w-full border-2 focus:outline-none focus:ring-1 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-1 me-2 "/>
            <button onClick={(e) => {handleSignIn(e)} } className="disabled:opacity-50 disabled:pointer-events-none mt-2 w-full text-white bg-black border-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 lg:mb-8">Sign In</button>
            </div>
           </form>
        </div>
    </div>
 
}
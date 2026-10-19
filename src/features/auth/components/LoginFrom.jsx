import { Link, useNavigate } from "react-router-dom";
import ButtonSpinner from "../../../components/ButtonSpinner";
import useLogin from "../hooks/useLogin";
import { useForm } from "react-hook-form";
import useCookie from "react-use-cookie";
import { method } from "lodash";
import toast from "react-hot-toast";

const LoginFrom = () => {

  const {
    register, handleSubmit, formState: { isSubmitting, errors }
  } = useForm();

  const [token,setToken]=useCookie('token');

  
  
  const [userCookie,setUserCookie]=useCookie('user');
  const navigate = useNavigate();
  const handleLogin = async (data) => {
    try {
      const payload = {
        email: data.email,
        password: data.password
      }
      const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers:
        {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload)
      })
      const json=await res.json();

     
      
      if (res.status === 200)  {
        toast.success('Login Successfully');
        setToken(json.access_token);
        setUserCookie(JSON.stringify(json.user));
        navigate("/")
      }

    } catch (error) {
      console.log(error.message);

    }
  }

  return (
    // <form
    //   className="space-y-4 md:space-y-6"
    //   onSubmit={handleSubmit(handleLogin)}
    // >
    //   <div>
    //     <label
    //       htmlFor="email"
    //       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    //     >
    //       Your email
    //     </label>
    //     <input
    //       type="email"
    //       {...register("email")}
    //       id="email"
    //       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //       placeholder="name@company.com"
    //       required
    //     />
    //   </div>
    //   <div>
    //     <label
    //       htmlFor="password"
    //       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    //     >
    //       Password
    //     </label>
    //     <input
    //       type="password"
    //       {...register("password")}
    //       id="password"
    //       placeholder="••••••••"
    //       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //       required
    //     />
    //   </div>
    //   <div className="flex items-center justify-between">
    //     <div className="flex items-start">
    //       <div className="flex items-center h-5">
    //         <input
    //           id="remember"
    //           aria-describedby="remember"
    //           type="checkbox"
    //           className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
    //         />
    //       </div>
    //       <div className="ml-3 text-sm">
    //         <label
    //           htmlFor="remember"
    //           className="text-gray-500 dark:text-gray-300"
    //         >
    //           Remember me
    //         </label>
    //       </div>
    //     </div>
    //     <a
    //       href="#"
    //       className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
    //     >
    //       Forgot password?
    //     </a>
    //   </div>
    //   <button
    //     type="submit"
    //     disabled={isSubmitting}
    //     className="w-full text-white flex disabled:pointer-events-none disabled:opacity-80 justify-center items-center gap-3 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    //   >
    //     Sign in
    //     {isSubmitting && <ButtonSpinner />}
    //   </button>
    //   <p className="text-sm font-light text-gray-500 dark:text-gray-400">
    //     Don’t have an account yet?{" "}
    //     <Link
    //       to="/register"
    //       className="font-medium text-blue-600 hover:underline dark:text-blue-500"
    //     >
    //       Sign up
    //     </Link>
    //   </p>
    // </form>
    <form className="space-y-5" onSubmit={handleSubmit(handleLogin)}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <rect width={20} height={16} x={2} y={4} rx={2} />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <input type="email" placeholder="you@example.com" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            {...register('email', {
              required: 'Email is required'
            })} />
          {
            errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )
          }
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <rect width={18} height={11} x={3} y={11} rx={2} ry={2} />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <input type="password" placeholder="••••••••" className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            {
            ...register('password', {
              required: 'Password is required'
            })
            } />
          {
            errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )
          }
          <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx={12} cy={12} r={3} />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black" />
          <span className="text-gray-600">Remember me</span>
        </label>
        <a href="#" className="font-medium text-gray-900 hover:underline">
          Forgot password?
        </a>
      </div>
      <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-medium text-sm hover:bg-gray-800 transition duration-200">
        Sign in
      </button>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-400">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button type="button" className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>
        <button type="button" className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          Apple
        </button>
      </div>
    </form>
  );
};

export default LoginFrom;

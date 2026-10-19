
import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast';
import { HiEye, HiLockClosed } from 'react-icons/hi'
import useCookie from "react-use-cookie";


const PasswordChangeForm = () => {
    const {register,handleSubmit,watch,formState:{errors,isSubmitting}}=useForm();
    const [token]=useCookie('token');

    
      
    


    console.log(token);
    

    const onPwdChange=async(data)=>{
        try {
            const res= await fetch('http://127.0.0.1:8000/api/auth/change-password',
                {
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
                    },
                    body:JSON.stringify(
                        {
                            old_password: data.old_password,
                            new_password: data.new_password,
                        }
                    )
                }
            )

            const result=await res.json();

            if (!res.ok) {
                toast.error(result.detail)
      
    }


            if(res.ok)
            {
                toast.success('Password updated successfully')
                console.log('Password updated successfully');
            }
            
        } catch (error) {
                console.log(error.message);
                

        }

        console.log(data);
        
    }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onPwdChange)}>
      <div className="mb-2 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
          <HiLockClosed size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Password Settings
          </h2>
          <p className="text-sm text-gray-500">
            Choose a strong password for your account.
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="oldPassword"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Current Password
        </label>

        <div className="relative">
          <input
            id="oldPassword"
            type="password"
            {...register('old_password',
                {
                    required:'Password is required'
                })}
            placeholder="Enter your current password"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/10"
          />
          {
            errors.old_password && (
                <p className="mt-2 text-sm text-red-500">
    {errors.old_password.message}
  </p>

            )
          }

          <HiEye
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          New Password
        </label>

        <div className="relative">
          <input
            id="newPassword"
            type="password"
            {...register('new_password',{
                required:'New password is required',
                minLength:{
                    value:6,
                    message:'Password must be at least * characters'
                },
                // validate:(value)=> value === watch('old_password') || 'New password must be different from current password'
            })}
            placeholder="Enter your new password"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/10"
          />
          {
            errors.new_password && 
            (
                <p className="mt-2 text-sm text-red-500">
    {errors.new_password.message}
  </p>

            )
          }


          <HiEye
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
          />
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Use at least 6 characters.
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Confirm New Password
        </label>

        <div className="relative">
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword',{
                required:'Confirm Password is required',
                validate:(value)=> value === watch('new_password') || 'Password do not match'
            })}
            placeholder="Re-enter your new password"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-brand focus:ring-2 focus:ring-brand/10"
          />

          <HiEye
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
          />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <button
          type="submit"
          className="w-full rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
        >
          Update Password
        </button>
      </div>
    </form>
  )
}

export default PasswordChangeForm

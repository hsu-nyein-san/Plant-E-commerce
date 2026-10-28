import React, { useEffect, useState } from 'react'
import SectionHeader from './SectionHeader'
import CheckoutField from './CheckoutField'
import { ChevronDown, ToyBrick } from 'lucide-react'
import RadioOption from './RadioOption'
import { useForm } from 'react-hook-form'
import useCookie from 'react-use-cookie'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../../components/Button'

const ShippingSection = ({ initialData = {}, onNext }) => {

  const navigate = useNavigate();

  const [userCookie] = useCookie("user");

  const user = userCookie ? JSON.parse(userCookie) : [];

  const [draftData, setDraftData] = useState(false);

  const [token] = useCookie("token");

  const [address, setAddress] = useState("");

  const [isSaved, setIsSaved] = useState(false);




  useEffect(() => {

    const fetchAddress = async () => {
      const res = await fetch(
        "http://127.0.0.1:8000/api/addresses/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Address API error: ${res.status}`);
      }

      const data = await res.json();
      setAddress(data);
    };

    const fetchDraftdata = async () => {
      let result = null;
      if (user.id) {
        const res = await fetch(
          "http://127.0.0.1:8000/api/checkout-draft",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );



        result = await res.json();
      }
      else {
        const savedDraft = localStorage.getItem("checkout_draft");
        result = savedDraft ? JSON.parse(savedDraft) : null;
      }

const draft = user?.id
  ? result?.draft_data
  : result?.shipping_address
    ? result
    : null;



      if (draft) {
        setDraftData(true);
        setAddress(result?.draft_data?.shipping_address || result);
      } else {
        setDraftData(false);
        await fetchAddress();
      }

    };

    fetchDraftdata().catch((error) => {
      console.error("Checkout fetch error:", error);
    });
  }, [user?.id, token]);


  console.log(isSaved);


  const { register,
    handleSubmit, reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user.full_name || initialData.fullName || '',
      email: user.email || initialData.email || '',
      phone: user.phone || initialData.phone || '',
      address: initialData.address || '',
      apt: initialData.apt || '',
      city: initialData.city || '',
      state: initialData.state || 'Oregon',
      zip: initialData.zip || '',
      delivery: 'Leave at door',
      dateTime: 'Morning',
      saveAddress: false,
    },
    mode: 'onBlur',
  })


  useEffect(() => {
    if (!address) return;

    const savedAddress = Array.isArray(address)
      ? address[0]
      : address.shipping_address || address;

    if (!savedAddress) return;



    reset({
      fullName:
        savedAddress.fullName || savedAddress.full_name || savedAddress.recipient_name || user?.full_name || initialData?.fullName || "",
      email:
        savedAddress.email || user?.email || initialData?.email || "",
      phone:
        savedAddress.phone || user?.phone || initialData?.phone || "",
      address:
        savedAddress.address_line || savedAddress.address || initialData?.address || "",
      apt: savedAddress.apt || initialData?.apt || "",
      city: savedAddress.city || initialData?.city || "",
      state:
        savedAddress.region?.replace(" Region", "") ||
        savedAddress.state ||
        initialData?.state ||
        "Oregon",
      zip:
        savedAddress.postal_code || savedAddress.zip || initialData?.zip || "",
      delivery: "Leave at door",
      dateTime: "Morning",
      saveAddress: false,
    });
  }, [
    address,
    user?.full_name,
    user?.email,
    user?.phone,
    initialData?.fullName,
    initialData?.email,
    initialData?.phone,
    initialData?.address,
    initialData?.apt,
    initialData?.city,
    initialData?.state,
    initialData?.zip,
    reset,
  ]);




  const handleSave = async (data) => {

    if (user.id) {
      const res = await fetch(
        "http://127.0.0.1:8000/api/checkout-draft",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shipping_address: data,
          }),
        }
      );


      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        navigate("/shop");
      }
    }
    else {
      localStorage.setItem("checkout_draft", JSON.stringify(data))
      navigate("/shop");
    }
  };

  console.log(address);


  const onSubmit = async (data) => {
    if (isSaved) {
      const res = await fetch('http://127.0.0.1:8000/api/addresses',
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipient_name: data.fullName,
            phone: data.phone,
            address_line:data.address,
            apt: data.apt,
            city: data.city,
            region: data.state,
            postal_code: data.zip,

          })
        }
      )
      const reult=await res.json();
      if(res.ok)
      {
        toast.success(reult.message)
      }
    }
    onNext?.(data)
  }
  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <SectionHeader
        number="1"
        title="Shipping"
        subtitle="Enter recipient details and choose delivery date & time."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <CheckoutField label="Full name" placeholder="Aye Aye"
          error={
            errors.fullName?.message
          }
          {
          ...register('fullName', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'At least 2 characters' }
          })
          }
        />
        <CheckoutField label="Email" placeholder="ayeaye@gmail.com"
          error={
            errors.email?.message
          }
          {
          ...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Invalid email',
            }
          })
          }
        />
        <CheckoutField label="Phone" placeholder="+1 (555) 000-0000"
          error={
            errors.phone?.message
          }
          {
          ...register('phone', {
            required: 'Phone is required',
            maxLength: {
              value: 11,
              message: 'Invalid phone'
            }
          })
          }
        />
        <CheckoutField label="Street address" placeholder="1234 Evergreen Ave"
          error={errors.address?.message}
          {
          ...register('address', {
            required: 'Address is required',
          })
          }
        />

        <CheckoutField {...register('apt')} label="Apt, suite, etc." placeholder="Apt 4B" optional
        />
        <CheckoutField label="City" placeholder="Portland"
          error={errors.city?.message}
          {
          ...register('city', {
            required: 'City is required'
          })
          }
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-600 font-medium">
            State / Region
          </label>

          <div className="relative">
            <select
              {...register("state", {
                required: "Region is required",
              })}
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2.5 text-sm appearance-none focus:outline-none focus:border-black"
            >
              <option value="">Select Region / State</option>
              <option value="Ayeyarwady">Ayeyarwady Region</option>
              <option value="Bago">Bago Region</option>
              <option value="Magway">Magway Region</option>
              <option value="Mandalay">Mandalay Region</option>
              <option value="Sagaing">Sagaing Region</option>
              <option value="Tanintharyi">Tanintharyi Region</option>
              <option value="Yangon">Yangon Region</option>
              <option value="Naypyidaw">Naypyidaw Union Territory</option>
              <option value="Kachin">Kachin State</option>
              <option value="Kayah">Kayah State</option>
              <option value="Kayin">Kayin State</option>
              <option value="Chin">Chin State</option>
              <option value="Mon">Mon State</option>
              <option value="Rakhine">Rakhine State</option>
              <option value="Shan">Shan State</option>
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3 top-3 text-gray-400 pointer-events-none"
            />
          </div>

          {errors.state && (
            <p className="text-red-500 text-xs">{errors.state.message}</p>
          )}
        </div>
        <CheckoutField label="ZIP" placeholder="97205"
          error={errors.zip?.message}
          {
          ...register('zip')
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Delivery preferences</h3>
          <div className="space-y-3">
            <RadioOption {...register('delivery')} value="Leave at door" label="Leave at door" name="delivery" defaultChecked />
            <RadioOption {...register('delivery')} value="Signature required" label="Signature required" name="delivery" />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Choose delivery date & time</h3>
          <div className="flex gap-6 items-center">
            <div className="w-24 h-24 relative flex items-center justify-center">
              <div className="absolute top-2 left-2 w-10 h-10 bg-gray-800 rounded-full opacity-90"></div>
              <div className="absolute bottom-4 left-0 w-6 h-6 bg-gray-800 rounded-full opacity-80"></div>
              <div className="absolute top-6 right-2 w-8 h-8 bg-gray-800 rounded-full opacity-70"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-gray-800 rounded-full opacity-90"></div>
            </div>
            <div className="flex-1 space-y-3">
              {
                [
                  { label: 'Morning — 9:00 AM – 12:00 PM', value: 'Morning', popular: true },
                  { label: 'Afternoon — 12:00 PM – 4:00 PM', value: 'Afternoon' },
                  { label: 'Evening — 4:00 PM – 8:00 PM', value: 'Evening' },
                ].map((slot) => (
                  <label
                    key={slot.value}
                    className="block p-3 border border-gray-200 rounded-md cursor-pointer hover:border-black transition-colors has-[:checked]:border-black has-[:checked]:bg-gray-50"
                  >
                    <input
                      type="radio"
                      value={slot.value}
                      {...register('dateTime')}
                      className="hidden"
                    />
                    <p className="text-xs font-medium">{slot.label}</p>
                    {slot.popular && (
                      <p className="text-[10px] text-gray-500 mt-1">Most popular</p>
                    )}
                  </label>

                ))
              }
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
        {
          user.id ? (
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={isSaved} onChange={(e) => setIsSaved(e.target.checked)} id="save" className="accent-black" />
              <label htmlFor="save" className="text-sm text-gray-600">Save this address for future orders</label>
            </div>
          ) : (<Link to="/login">
            <Button text="login" variant="dark" /></Link>)
        }
        <div className="flex gap-4">
          <button onClick={handleSubmit(handleSave)} className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-black transition-colors">
            Save & continue later
          </button>
          <button type='submit' className="px-6 py-3 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
            Continue to payment
          </button>
        </div>
      </div>



    </form>
  )
}

export default ShippingSection
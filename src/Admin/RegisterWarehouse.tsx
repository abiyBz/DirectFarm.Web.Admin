// import React, { useState } from 'react';
// import axios from 'axios';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Schema for registering a warehouse manager
// const warehouseManagerSchema = z.object({
//   fName: z.string().min(1, { message: "First name is required" }),
//   lName: z.string().min(1, { message: "Last name is required" }),
//   email: z.string().email({ message: "Invalid email address" }),
//   phone: z.string().min(1, { message: "Phone number is required" }),
//   status: z.enum(['active', 'inactive'], { message: "Status must be 'active' or 'inactive'" }),
//   password: z.string().min(8, { message: "Password must be at least 8 characters" }),
// });

// type WarehouseManagerFormData = z.infer<typeof warehouseManagerSchema>;

// const CreateAdmin: React.FC = () => {
//   const { register, handleSubmit, formState: { errors }, reset } = useForm<WarehouseManagerFormData>({
//     resolver: zodResolver(warehouseManagerSchema),
//   });
//   const [loading, setLoading] = useState<boolean>(false);

//   const onSubmit = async (data: WarehouseManagerFormData) => {
//     setLoading(true);
//     try {
//       const response = await axios.post('http://localhost:5122/api/Warehouse/RegisterWarehouseManager', {
//         id: "00000000-0000-0000-0000-000000000000", // Placeholder ID, actual ID generation should be server-side
//         fName: data.fName,
//         lName: data.lName,
//         email: data.email,
//         phone: data.phone,
//         status: data.status,
//         password: data.password
//       });
      
//       if (response.data.isFailed) {
//         toast.error(response.data.message || "Registration failed");
//       } else {
//         toast.success('Warehouse Manager registered successfully');
//         reset(); // Reset form after successful submission
//       }
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         toast.error(error.message);
//       } else if (
//         typeof error === 'object' && 
//         error !== null && 
//         'response' in error &&
//         error.response &&
//         typeof error.response === 'object' &&
//         'data' in error.response &&
//         error.response.data &&
//         typeof error.response.data === 'object' &&
//         'message' in error.response.data &&
//         typeof error.response.data.message === 'string'
//       ) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error('Registration failed due to an unexpected error');
//       }
//       console.error('Registration error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-300 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-xl">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Register New Warehouse Manager
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="fName" className="sr-only">First Name</label>
//               <input 
//                 {...register("fName")}
//                 id="fName" 
//                 name="fName" 
//                 type="text" 
//                 autoComplete="given-name" 
//                 required 
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
//                 placeholder="First Name"
//               />
//               {errors.fName && <p className="text-red-500 text-xs mt-1">{errors.fName.message}</p>}
//             </div>

//             <div>
//               <label htmlFor="lName" className="sr-only">Last Name</label>
//               <input 
//                 {...register("lName")}
//                 id="lName" 
//                 name="lName" 
//                 type="text" 
//                 autoComplete="family-name" 
//                 required 
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
//                 placeholder="Last Name"
//               />
//               {errors.lName && <p className="text-red-500 text-xs mt-1">{errors.lName.message}</p>}
//             </div>

//             <div>
//               <label htmlFor="email-address" className="sr-only">Email address</label>
//               <input 
//                 {...register("email")}
//                 id="email-address" 
//                 name="email" 
//                 type="email" 
//                 autoComplete="email" 
//                 required 
//                 className="appearance-none rounded-none relative block w-11/12 px-3 py-2 border border-gray-300 placeholder-gray-500 text-white focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//               />
//               {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
//             </div>
//             <label className='text-gray-600 text-base'>Phone Number</label>
//             <div>
//               <label htmlFor="phone" className="sr-only">Phone Number</label>
//               <input 
//                 {...register("phone")}
//                 id="phone" 
//                 name="phone" 
//                 type="text" 
//                 autoComplete="tel" 
//                 required 
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
//                 placeholder="Phone Number"
//               />
//               {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
//             </div>

//             <div>
//               <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//               <select 
//                 {...register("status")}
//                 id="status" 
//                 name="status" 
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
//               >
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//               {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
//             </div>
//             <label className='text-gray-600 text-base'>Password</label>
//             <div>
//               <label htmlFor="password" className="sr-only">Password</label>
//               <input 
//                 {...register("password")}
//                 id="password" 
//                 name="password" 
//                 type="password" 
//                 autoComplete="new-password" 
//                 required 
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-500 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//               />
//               {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
//             </div>
//           </div>

//           <div>
//             <button 
//               type="submit" 
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//               disabled={loading}
//             >
//               {loading ? 'Registering...' : 'Register'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateAdmin;
import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Schema for registering a warehouse manager
const warehouseManagerSchema = z.object({
  fName: z.string().min(1, { message: "First name is required" }),
  lName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  status: z.enum(['active', 'inactive'], { message: "Status must be 'active' or 'inactive'" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // path of error
});

type WarehouseManagerFormData = z.infer<typeof warehouseManagerSchema>;

const CreateAdmin: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<WarehouseManagerFormData>({
    resolver: zodResolver(warehouseManagerSchema),
  });
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: WarehouseManagerFormData) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5122/api/Warehouse/RegisterWarehouseManager', {
        id: "00000000-0000-0000-0000-000000000000", // Placeholder ID, actual ID generation should be server-side
        fName: data.fName,
        lName: data.lName,
        email: data.email,
        phone: data.phone,
        status: data.status,
        password: data.password
      });
      
      if (response.data.isFailed) {
        toast.error(response.data.message || "Registration failed");
      } else {
        toast.success('Warehouse Manager registered successfully');
        reset(); // Reset form after successful submission
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (
        typeof error === 'object' && 
        error !== null && 
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof error.response.data.message === 'string'
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed due to an unexpected error');
      }
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Register New Warehouse Manager
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="fName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                {...register("fName")}
                id="fName" 
                name="fName" 
                type="text" 
                autoComplete="given-name" 
                required 
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-transparent focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="First Name"
              />
              {errors.fName && <p className="text-red-500 text-xs mt-1">{errors.fName.message}</p>}
            </div>

            <div>
              <label htmlFor="lName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                {...register("lName")}
                id="lName" 
                name="lName" 
                type="text" 
                autoComplete="family-name" 
                required 
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-transparent focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Last Name"
              />
              {errors.lName && <p className="text-red-500 text-xs mt-1">{errors.lName.message}</p>}
            </div>

            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input 
                {...register("email")}
                id="email-address" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-transparent focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                {...register("phone")}
                id="phone" 
                name="phone" 
                type="text" 
                autoComplete="tel" 
                required 
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-transparent focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                {...register("status")}
                id="status" 
                name="status" 
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                {...register("password")}
                id="password" 
                name="password" 
                type="password" 
                autoComplete="new-password" 
                required 
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-transparent focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input 
                {...register("confirmPassword")}
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                autoComplete="new-password" 
                required 
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-transparent focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;
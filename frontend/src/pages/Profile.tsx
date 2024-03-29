import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { UserType } from '../types'
import { getUserById, updateUser } from '../services/userService'
import { MdPerson } from 'react-icons/md'
import { toast } from 'react-toastify'

const Profile = () => {

  const [user, setUser] = useState<UserType | undefined>();
  const [formData, setFormData] = useState<Partial<UserType>>();

  const location = useLocation();
  const userId = location.pathname.split('/')[2];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserById(userId);
        setUser(response);
      } catch (error) {
        console.error('Veri alınamadı:', error);
      }
    }
    fetchData()
  }, [userId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const updatedUserData: UserType = {
                ...user!,
                ...formData!,
            };

            await updateUser(userId, updatedUserData);

            const updatedResponse = await getUserById(userId);
            setUser(updatedResponse);

            console.log('User updated successfully!');
            toast.success("Kullanıcı Başarıyla Güncellendi!", {
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });

            setFormData({
                username: '',
                email: '',
                password: '',
            })

        } catch (error) {
            console.error('User update failed:', error);
            toast.error("Kullanıcı Güncellenirken Bir Hata Oluştu!", {
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
        }
    }

  return (
    <div className='flex max-w-[1440px] min-h-[630px] bg-slate-200 mx-auto p-12 h-fit'>
      <div className='w-1/4 p-5 rounded-lg'>
            { user?.image ? (
                <div className='w-full h-40 relative rounded-lg overflow-hidden'>
                    <img src={user?.image} alt="" />
                </div> 
                ) :
                <MdPerson className='w-full h-40 text-gray-400' />
            }
              <h3 className='font-semibold'>Kullanıcı Adı:</h3>
              <p className='mb-4'>{user?.username}</p>
              <h3 className='font-semibold'>Email:</h3>
              <p className='mb-4'>{user?.email}</p>
              <h3 className='font-semibold'>Rolü:</h3>
              <p>{user?.isAdmin ? "Admin" : "Kullanıcı"}</p>
        </div>
        <div className='w-1/2 p-5 rounded-lg'>
            <form className='flex flex-col' onSubmit={handleSubmit}>
                <label>Kullanıcı Adı</label>
                <input 
                    className='p-3 border border-gray-300 rounded-md bg-white mt-2 mb-4 outline-none' 
                    type="text" 
                    name="username" 
                    placeholder={user?.username} 
                    value={formData?.username}
                    onChange={handleChange}
                />
                <label>Email</label>
                <input 
                    className='p-3 border border-gray-300 rounded-md bg-white mt-2 mb-4 outline-none' 
                    type="email" 
                    name="email" 
                    placeholder={user?.email} 
                    value={formData?.email}
                    onChange={handleChange}
                />
                <label>Şifre</label>
                <input 
                    className='p-3 border border-gray-300 rounded-md bg-white mt-2 mb-4 outline-none' 
                    type="password" 
                    name="password" 
                    placeholder={user?.password} 
                    value={formData?.password}
                    onChange={handleChange}
                />
                <button 
                    className='bg-orange-500 text-white py-3 px-4 rounded-full mt-4'
                    type="submit"
                >   
                    Güncelle
                </button>
            </form>
        </div>
    </div>
  )
}

export default Profile
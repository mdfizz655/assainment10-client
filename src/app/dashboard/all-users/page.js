"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";



export default function AllUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => { fetchUsers(); }, []);



  const fetchUsers = async () => {
    const token = localStorage.getItem("access-token");
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/all-users`, {
      headers: { authorization: `Bearer ${token}` }
    });
    setUsers(res.data);
  };

  


  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("access-token");
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/role/${userId}`, 
        { role: newRole }, 
        { headers: { authorization: `Bearer ${token}` } }
      );
      
      if (res.data.modifiedCount > 0) {
        toast.success(`Role updated to ${newRole}`);
        fetchUsers(); 
      }
    } catch (error) {
      toast.error("Failed to update role");
    }
  };




  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-black text-white uppercase italic">User Role Management</h1>
      </header>


      <div className="bg-[#0F172A] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">User</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Subscription</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Role Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-5">
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-[10px] text-cyan-400 font-medium">{user.email}</p>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase">
                    {user.status || 'Free'}
                  </span>
                </td>
                <td className="px-8 py-5 text-center">
                  

                  

                  
                   <select 
                      defaultValue={user.role || "User"} 
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="bg-[#1e293b] text-white text-[10px] font-black uppercase p-2 rounded-lg border border-white/10 outline-none cursor-pointer focus:border-cyan-500"
                   >
                      <option value="User">User</option>
                      <option value="Creator">Creator</option>
                      <option value="Admin">Admin</option>
                   </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
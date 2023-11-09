import React, { useEffect } from 'react'

const Users = () => {
  useEffect(() => {
    const handleReq = async () => {

        try {
            const res = await fetch('http://localhost:3000/api/users/user')
            console.log(await res.json())
        } catch (error) {
            console.log(error);
        }
    }
    handleReq() 
  }, [])
  return (
    <div>Users</div>
  )
}

export default Users
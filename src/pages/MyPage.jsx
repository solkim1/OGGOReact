//마이페이지! (정보수정, 회원탈퇴)
import React,{useEffect} from 'react'
import { useContext } from 'react';
import { UserContext } from '../context/UserProvider';

const MyPage = () => {
  const {user} = useContext(UserContext);

  useEffect(()=>{
    console.log(user)
  });

  return (
    <div>MyPage</div>
  )
}

export default MyPage
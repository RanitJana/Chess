import React from 'react';
import { useParams } from 'react-router';

function Profile() {
  const { userId } = useParams();
  console.log(userId);
  
  return (

    <div>Profile</div>
  )
}

export default Profile
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import { useNavigate, useParams } from 'react-router';

function Friends() {

    const { userId } = useParams();
    const navigate = useNavigate();
    const [friends, setFriends] =
        useState([
            { name: "Neha", "_id": '6769c43cddfe8c4bfa72f160', "rating": 200 },
            { name: "Shouvik", "_id": '676850be6f3872e641d267db', "rating": 200 }
        ]);
    const [pendingFriends, setPendingFriends] = useState([
        { name: "Sampa", "_id": '6769c43cddfe8c4bfa72f160', "rating": 200 },
    ])

    return (
        <div className="flex flex-col items-center sm:p-8 p-2">
            <div className="max-w-[970px] w-full flex flex-col gap-5">
                {<NavBar />}
                <p className='flex items-center justify-start gap-5'>
                    <img src="/images/friends.png" alt="" />
                    <span className='font-bold text-white text-2xl'>Friends</span>
                </p>
                <div className='rounded-md bg-blackDarkest p-6 flex flex-col gap-6'>
                    <div className='relative flex w-full'>
                        <img src="/images/search.png" alt=""
                            className='absolute left-3 top-1/2 translate-y-[-50%] w-6'
                        />
                        <input
                            type="text"
                            name=""
                            id=""
                            className='w-full bg-[rgb(61,58,57)] text-white outline-none p-3 pl-12 rounded-sm'
                            placeholder='Search by name'
                        />
                    </div>
                    <div>
                        <div>
                            <span className='text-white mr-2 font-semibold'>Friend requests</span>
                            <span className='bg-blackLight text-white px-2 py-1 rounded-md'>{pendingFriends.length}</span>
                        </div>
                    </div>
                    {
                        pendingFriends?.length ?
                            <ul className='flex flex-col gap-7'>
                                {
                                    pendingFriends.map(user => {
                                        return (
                                            <li key={user._id} className='flex relative'>
                                                <div className='flex items-center gap-5 min-w-fit'>
                                                    <div className='w-20'>
                                                        <img src={user.avatar || '/images/user-pawn.gif'} alt="Dp" className='w-20' />
                                                    </div>
                                                    <div>
                                                        <span className='text-white font-semibold hover:cursor-pointer' onClick={() => navigate(`/member/${user._id}`)}>{user.name} </span>
                                                        <span className='text-gray-400 hover:cursor-pointer' onClick={() => navigate(`/member/${user._id}`)}>({user.rating})</span>
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-3 absolute top-1/2 right-0 translate-y-[-50%] bg-blackDarkest'>
                                                    <button className=' bg-[rgb(61,58,57)] rounded-md h-10 flex items-center justify-center w-[3rem] active:bg-blackLight transition-colors'>
                                                        <img src="/images/cross.png" alt="" className='w-6' />
                                                    </button>
                                                    <button className=' bg-[rgb(61,58,57)] rounded-md h-10 flex items-center justify-center w-[3rem] active:bg-blackLight transition-colors'>
                                                        <img src="/images/tick.png" alt="" className='w-5' />
                                                    </button>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul> : ""
                    }
                    <div>
                        <div>
                            <span className='text-white mr-2 font-semibold'>Friends</span>
                            <span className='bg-blackLight text-white px-2 py-1 rounded-md'>{friends.length}</span>
                        </div>
                    </div>
                    {
                        friends?.length ?
                            <ul className='flex flex-col gap-7'>
                                {
                                    friends.map(user => {
                                        return (
                                            <li key={user._id} className='flex justify-between'>
                                                <div className='flex items-center gap-5'>
                                                    <div className='w-20'>
                                                        <img src={user.avatar || '/images/user-pawn.gif'} alt="Dp" className='w-20' />
                                                    </div>
                                                    <div>
                                                        <span className='text-white font-semibold hover:cursor-pointer' onClick={() => navigate(`/member/${user._id}`)}>{user.name} </span>
                                                        <span className='text-gray-400 hover:cursor-pointer' onClick={() => navigate(`/member/${user._id}`)}>({user.rating})</span>
                                                    </div>
                                                </div>
                                                <div></div>
                                            </li>
                                        )
                                    })
                                }
                            </ul> : ""
                    }
                </div>
            </div>
        </div>
    )
}

export default Friends
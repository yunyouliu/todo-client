import React from 'react'
import {Empty} from 'antd'

const Assignedme: React.FC =  ()=>{
  return (
    <div className="w-full h-full flex justify-center items-center mt-40">
        <Empty description="暂无数据"  className='text-gray-400'/>
    </div>
  )
}

export default Assignedme
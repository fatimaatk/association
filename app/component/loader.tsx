import React from 'react'
import { SyncLoader } from 'react-spinners'


interface IProps {
  loading: boolean
}
const Loader = ({ loading }: IProps) => {
  return (
    <div>  {loading &&
      <div className="flex items-center justify-center h-screen ">
        <SyncLoader color="#f16b1f" />
      </div>}</div>
  )
}

export default Loader
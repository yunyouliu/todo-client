import request from "@/utils/request";

export const getProjectsByUserId=(userId:string)=>{
  return request({
    url:`/projects/user/${userId}`,
    method:"GET",
  })
}

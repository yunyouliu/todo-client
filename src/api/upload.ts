import request from "@/utils/request";
export const uploadImage = (data: FormData) => {
  return request({
    url: "/upload/image",
    method: "POST",
    data,
  });
};

export const uploadFile = (data: FormData) => {
  return request({
    url: "/upload/file",
    method: "POST",
    data,
  });
};

import request from "@/utils/request";

export const getTags = () => {
  return request({
    url: "/tags",
    method: "GET",
  });
};

export const addTag = (data: any) => {
  return request({
    url: "/tags",
    method: "POST",
    data,
  });
};

//removeTag
export const removeTag = (id: string) => {
  return request({
    url: `/tags/${id}`,
    method: "DELETE",
  });
};
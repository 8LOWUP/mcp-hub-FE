import axiosInstance from "../AxiosInstance";

const getChat = async () => {
  const response = await axiosInstance.get("/chat");
  return response.data;
};

export { getChat };
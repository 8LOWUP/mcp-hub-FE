import axiosInstance from "../AxiosInstance";

const getChat = async () => {
  const response = await axiosInstance.get("/chat".CHAT.GET);
  return response.data;
};

export { getChat };
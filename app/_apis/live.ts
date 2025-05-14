import api from "./auto_refresh_axios";
import axios from "axios";

export async function getLiveList() {
  const response = await api.get("/api/live", {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function requestPlay(streamId: string, password?: string) {
  const requestBody = {
    stream_id: streamId,
    password: password,
  };
  const response = await api.post("/api/play", requestBody, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function requestLobyPlay(streamId: string, password?: string) {
  const requestBody = {
    stream_id: streamId,
    password: password,
  };
  const response = await axios.post("/api/play", requestBody, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function reqeustChat(broadcastId: string, message: string) {
  const requestBody = {
    broadcaster_id: broadcastId,
    message: message,
  };
  const response = await axios.post("/api/chat", requestBody, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

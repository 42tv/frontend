import api from "./auto_refresh_axios";
import axios from "axios";
import { PlayData } from "../_components/utils/interfaces";

export async function getLiveList() {
  const response = await api.get("/api/live", {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
  return response.data;
}

export async function requestPlay(streamId: string, password?: string): Promise<PlayData> {
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

export async function requestLike(broadcasterIdx: number) {
  const requestBody = {
    broadcaster_idx: broadcasterIdx,
  };
  const response = await api.post("/api/live/recommend", requestBody, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function getViewersList(broadcasterId: string) {
  const response = await api.get(`/api/live/${broadcasterId}/viewers`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function kickViewer(broadcasterId: string, viewerId: string, reason?: string) {
  const requestBody = {
    viewer_id: viewerId,
    reason: reason,
  };
  const response = await api.post(`/api/live/${broadcasterId}/kick`, requestBody, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

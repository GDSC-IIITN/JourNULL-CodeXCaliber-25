"use client";
import axios from "axios";
import { ChangeEvent, useState } from "react";

export default function Home() {
  const [files, setFiles] = useState<File | null>(null);
  async function handleImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      return;
    }
    setFiles(file);
  }

  async function handleUpload() {
    const form = new FormData();
    form.append("file", files as File);
    try {
      const res = await axios.post("/api/upload", form);
      const url = res.data.objectUrl;
      console.log("url", url);
      console.log("file", files);
      // await axios.put(
      //   url,
      //   { file },
      //   {
      //     headers: {
      //       "Content-Type": file.type,
      //     },
      //   }
      // );
      alert("File uploaded successfully");
    } catch (error) {
      console.error("error:", error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "An unknown error occurred";
      alert(errorMessage);
    }
  }

  return (
    <>
      <input type="file" onChange={handleImage} />
      <button onClick={handleUpload}>Upload</button>
      {/* {img && (
        <>
          <img src={img} alt="" />
        </>
      )} */}
    </>
  );
}

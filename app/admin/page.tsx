"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import logOut from "@/firebase/logout";
import { updateModelInDisplay, uploadModel } from "@/firebase/uploadModel";
import listModels, { IModels } from "@/firebase/listModels";
import { getModelPath } from "@/firebase/getModel";

export default function Admin() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [file, setFile] = useState<File>();
  const [models, setModels] = useState<IModels[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [uploadResult, setUploadResult] = useState<string>("");
  const [updateResult, setUpdateResult] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLogOut = async () => {
    const { result, error } = await logOut();

    if (error) {
      return console.log(error);
    }

    console.log(result);
    return router.push("/");
  };

  const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    if (!file) {
      setSubmitting(false);
      return setUploadResult("No file selected.");
    }

    try {
      await uploadModel(file);
      setUploadResult("Model uploaded: " + file.name);
      setLoading(true);
    } catch (e: any) {
      setUploadResult("An error occured while uploading: " + e.message);
      console.error(e);
    }
    setSubmitting(false);
  };

  const handleSelectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const selected = formData.get("selectModel");
    await updateModelInDisplay(selected as string)
      .then((result) => {
        setUpdateResult("Model in display updated.");
      })
      .catch((e) => {
        setUpdateResult("An error occured while updating: " + e.message);
        console.error(e);
      });
    setSubmitting(false);
  };

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchModels = async () => {
      const path = await getModelPath();
      setSelectedModel(path);

      const models = await listModels();
      setModels(models);

      setLoading(false);
    };
    fetchModels();
  }, [loading]);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold text-center">401</h1>
      </div>
    );
  } else {
    return (
      <>
        <div className="p-4 h-screen">
          <h1 className="text-2xl font-bold mb-4 text-center">Admin</h1>
          <form className="mb-4" onSubmit={handleUploadSubmit}>
            <input
              type="file"
              name="file"
              onChange={(e) => setFile(e.target.files?.[0])}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <p className="text-sm text-gray-500 mt-2">{uploadResult}</p>
            <button
              type="submit"
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              Upload
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Only .glb and .gltf files are supported.
            </p>
          </form>
          <hr className="my-4" />
          <form onSubmit={handleSelectSubmit}>
            {!loading &&
              models.map((model) => (
                <div key={model.name} className="mb-2">
                  <input
                    type="radio"
                    value={model.path}
                    id={model.path}
                    name="selectModel"
                    defaultChecked={selectedModel === model.path}
                    className="form-radio text-blue-500 focus:ring-blue-400 h-4 w-4 mr-2"
                  />
                  <label htmlFor={model.path} className="inline-block">
                    {model.name}
                  </label>
                </div>
              ))}
            <p className="text-sm text-gray-500 mt-2">{updateResult}</p>
            <input
              type="submit"
              value="Change model in display"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            />
          </form>
          <hr className="my-4" />
          <button
            onClick={handleLogOut}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Log out
          </button>
        </div>
      </>
    );
  }
}

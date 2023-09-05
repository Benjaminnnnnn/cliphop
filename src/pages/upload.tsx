import { SanityAssetDocument } from "@sanity/client";
import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { client } from "../utils/client";

import axios from "axios";
import { useRouter } from "next/router";
import { IoMdArrowBack } from "react-icons/io";
import useAuthStore from "../store/authStore";
import { topics } from "../utils/constants";

const Upload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [wrongFileType, setWrongFileType] = useState(false);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(topics[0].name);
  const [savingPost, setSavingPost] = useState(false);
  const [videoAsset, setVideoAsset] = useState<
    SanityAssetDocument | undefined
  >();
  const { userProfile } = useAuthStore();
  const router = useRouter();
  const fileTypes = ["video/mp4", "video/webm", "video/ogg"];

  const uploadVideo = async (e: any) => {
    const selectedFile = e.target.files[0];

    if (fileTypes.includes(selectedFile.type)) {
      // upload video to sanity backend
      try {
        const data = await client.assets.upload("file", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        });
        setVideoAsset(data);
        setIsLoading(false);
      } catch (error) {}
    } else {
      setIsLoading(false);
      setWrongFileType(true);
    }
  };

  const handlePost = async () => {
    if (caption && videoAsset?._id && category) {
      setSavingPost(true);

      const document = {
        _type: "post",
        caption: caption,
        video: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: videoAsset?._id,
          },
        },
        userId: userProfile?._id,
        postedBy: {
          _type: "postedBy",
          _ref: userProfile?._id,
        },
        topic: category,
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/post`,
        document
      );
      router.push("/");
    }
  };

  const handleDiscard = () => {};

  return (
    <div className="absolute left-0 top-0 flex h-[100vh] w-full bg-white lg:h-full lg:justify-center">
      <div className="absolute left-4 top-6 z-50 flex gap-6 lg:left-6">
        <a onClick={() => router.back()}>
          <IoMdArrowBack className="cursor-pointer text-3xl"></IoMdArrowBack>
        </a>
      </div>

      <div className="flex h-full w-full flex-col items-stretch gap-6 rounded-lg bg-white p-14 pt-6 lg:w-3/5 lg:justify-center lg:gap-12 ">
        <div className="flex flex-col items-center">
          <div className="self-start">
            <p className="text-2xl font-bold lg:mt-10">Upload Video</p>
            <p className="mt-1 text-gray-400">Post a video to your account</p>
          </div>
          <div
            className="roudned-xl group mt-8 flex aspect-[9/16] max-h-[600px]
                      cursor-pointer flex-col items-center justify-center
                      border-4 border-dashed border-gray-400 p-4
                      outline-none hover:border-blue-300
                      hover:bg-gray-100 lg:aspect-video lg:max-h-none "
          >
            {isLoading ? (
              <p>Uploading</p>
            ) : (
              <div className="h-full w-full">
                {videoAsset ? (
                  <div>
                    <video
                      src={videoAsset.url}
                      loop
                      controls
                      className=" rounded-xl bg-black"
                    ></video>
                  </div>
                ) : (
                  <div className="h-full w-full">
                    <label className="cursor-pointer">
                      <div className="flex h-full flex-col items-center justify-center">
                        {/* <div className="flex flex-1 flex-col items-center justify-center"> */}
                        <p className="text-cl font-bold">
                          <FaCloudUploadAlt className="text-6xl text-gray-300"></FaCloudUploadAlt>
                        </p>
                        {/* <p className="text-xl group-hover:font-medium">
                            Upload Video
                          </p> */}
                        <p className="mt-5 text-center text-sm leading-8 text-gray-400">
                          MP4, WebM, or ogg (1280x720px or higher) <br />
                          Up to 10 mins <br />
                          Less than 2 GB
                          {/* MP4 or WebM or ogg <br />
                            1280x720 or higher <br />
                            Up to 10 mins <br />
                            Less than 2 GB */}
                        </p>

                        {/* <p className="text-md mt-10 w-52 rounded bg-[#F51997] p-2 text-center font-medium text-white outline-none"> */}
                        <p className="text-md mt-10 w-52 rounded bg-blue-500 p-2 text-center font-medium text-white outline-none active:bg-blue-700">
                          Select File
                        </p>
                        {/* </div> */}
                      </div>

                      <input
                        type="file"
                        name="upload-video"
                        className="h-0 w-0"
                        accept={fileTypes.join(",")}
                        onChange={uploadVideo}
                      ></input>
                    </label>
                  </div>
                )}
              </div>
            )}

            {wrongFileType && (
              // <p className="mt-4 w-[250px] text-center text-xl font-semibold text-red-400">
              <p className="mt-4 w-[250px] text-center text-xl font-semibold text-blue-300">
                Please select a video file
              </p>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col gap-3">
          <label className="text-base font-medium" htmlFor="caption">
            Caption
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => {
              setCaption(e.target.value);
            }}
            id="caption"
            className="rounded border-2 border-gray-200 p-2 text-base outline-none focus:outline-blue-400"
          />

          <label htmlFor="category">Choose a category</label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            className="cursor-pointer rounded border-2 border-gray-200 p-2 text-base capitalize outline-none focus:outline-blue-400 lg:p-4"
          >
            {topics.map((topic) => (
              <option key={topic.name} value={topic.name}>
                {topic.name}
              </option>
            ))}
          </select>

          <div className="mt-6 flex gap-6 pb-4">
            <button
              onClick={handleDiscard}
              type="button"
              className="flex-1 cursor-pointer rounded border-2 border-gray-300 p-2 text-base font-medium active:bg-gray-300 lg:w-44 lg:flex-none"
            >
              Discard
            </button>
            <button
              onClick={handlePost}
              type="button"
              // className="flex-1 cursor-pointer rounded border-2 border-gray-300 bg-[#F51997] p-2 text-base font-medium text-white lg:w-44 lg:flex-none"
              className="flex-1 cursor-pointer rounded border-2 border-gray-300 bg-blue-500 p-2 text-base font-medium text-white active:bg-blue-700 lg:w-44 lg:flex-none"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;

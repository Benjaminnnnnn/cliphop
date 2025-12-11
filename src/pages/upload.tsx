import { SanityAssetDocument } from "@sanity/client";
import { useMemo, useState } from "react";
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
  const isReadyToPost = useMemo(
    () =>
      caption.trim().length > 0 && videoAsset?._id && category && !savingPost,
    [caption, videoAsset?._id, category, savingPost]
  );

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

  const handleDiscard = () => {
    setVideoAsset(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 md:px-8 lg:max-h-screen lg:overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-slate-900">Upload Video</p>
            <p className="mt-1 text-sm text-slate-500">
              Drop your clip, add a caption, and pick a topic.
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <IoMdArrowBack className="text-lg" />
            Back
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 shadow-sm lg:max-h-[80vh]">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Video file
            </p>
            <div className="group flex aspect-[9/16] max-h-[65vh] w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50/80 p-3 shadow-inner shadow-white/60 transition hover:border-brand/50 hover:bg-white">
              {isLoading ? (
                <p className="text-sm text-slate-500">Uploading...</p>
              ) : (
                <>
                  {videoAsset ? (
                    <div className="relative h-full w-full overflow-hidden rounded-lg border border-slate-200 bg-black">
                      <video
                        src={videoAsset.url}
                        loop
                        controls
                        className="h-full w-full object-contain"
                      ></video>
                      <button
                        onClick={handleDiscard}
                        className="absolute right-3 top-3 rounded-full border border-white/40 bg-black/60 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:scale-105"
                      >
                        Replace
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 text-center">
                      <FaCloudUploadAlt className="text-5xl text-slate-300 group-hover:text-brand" />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-700">
                          Upload a video
                        </p>
                        <p className="text-xs text-slate-500">
                          MP4, WebM, or OGG · 1280x720+ · up to 10 mins · &lt;
                          2GB
                        </p>
                      </div>
                      <span className="mt-2 rounded-full bg-[#ff6b6b] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        Select file
                      </span>
                      <input
                        type="file"
                        name="upload-video"
                        className="hidden"
                        accept={fileTypes.join(",")}
                        onChange={uploadVideo}
                      ></input>
                    </label>
                  )}
                </>
              )}
            </div>
            {wrongFileType && (
              <p className="mt-3 text-sm font-semibold text-rose-500">
                Please select a supported video file.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label
              className="text-sm font-semibold text-slate-700"
              htmlFor="caption"
            >
              Caption
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
              }}
              id="caption"
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-base text-slate-800 transition focus:border-brand/50 focus:bg-white focus:outline-none"
              placeholder="Add a short caption"
            />

            <label
              className="text-sm font-semibold text-slate-700"
              htmlFor="category"
            >
              Topic
            </label>
            <select
              name="category"
              id="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-base capitalize text-slate-800 transition focus:border-brand/50 focus:bg-white focus:outline-none"
            >
              {topics.map((topic) => (
                <option key={topic.name} value={topic.name}>
                  {topic.name}
                </option>
              ))}
            </select>

            <div className="mt-2 flex gap-4">
              <button
                onClick={handleDiscard}
                type="button"
                className="flex-1 cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Discard
              </button>
              <button
                onClick={handlePost}
                type="button"
                disabled={!isReadyToPost}
                className={`flex-1 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  isReadyToPost
                    ? "bg-[#ff6b6b]"
                    : "cursor-not-allowed bg-slate-300 text-slate-100 hover:translate-y-0 hover:shadow-none"
                }`}
              >
                {savingPost ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
